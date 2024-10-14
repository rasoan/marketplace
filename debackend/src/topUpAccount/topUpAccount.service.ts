'use strict';

import type {
    ITable_ShopTransaction_Output,
    ITable_ShopTransactionInfo_Output,
    ITable_ShopTransactionUserInfo_Output,
    ITopUpAccountInput,
    ITopUpAccountOutput,
} from "./types/topUpAccount";

import { Inject, Injectable } from '@nestjs/common';
import { Pool } from "pg";

import { assertIsDefined } from "@detools/type_guards/base";
import { CurrencyType } from "@deshopfrontend/src/utils/constants";
import {
    checkLimitersAmountAndConditionalThrowError,
    convertCurrencyAmount,
    getAmountWithOurCommission,
    getLabelByExchangeType,
    getLabelByServiceId,
} from "@deshopfrontend/src/utils/topUpAccount/topUpAccount";
import { TopUpAccounts_ServiceLocalIdentifiers } from "@deshopfrontend/src/utils/topUpAccount/constants";

import { DATABASE_POOL } from "../database/database.module";
import { pgQueryAndNormaliseResponse, SqlRequestsGetter } from "./utils/sqlRequsts";
import { TopUpAccountConfigService } from "../topUpAccountConfig/topUpAccountConfig.service";
import { ExchangeRateService } from "../exchangeRate/exchangeRate.service";
import { PayGatewayWrapperService } from "../payGatewayWrapper/payGatewayWrapper.service";
import { EventEmitterWrapperService } from "../eventEmitterWrapper/eventEmitterWrapper.service";
import { IEventEmitterWrapper } from "../eventEmitterWrapper/types/eventEmitterWrapper";
import { Table_ShopTransaction_Columns, TableNames } from "./utils/types/sqlRequests";
import { topUpsEmitPalychPostbackNotificationEvent } from "./topUpAccount.resolver";
import { DataBaseUtils } from "../database/utils";

@Injectable()
export class TopUpAccountService {
    @Inject(DATABASE_POOL)
    private readonly _pool: Pool;
    @Inject(TopUpAccountConfigService)
    private _topUpAccountConfigService: TopUpAccountConfigService;
    @Inject(ExchangeRateService)
    private _exchangeRateService: ExchangeRateService;
    @Inject(PayGatewayWrapperService)
    private _payGatewayWrapperService: PayGatewayWrapperService;
    @Inject(EventEmitterWrapperService)
    private _eventEmitterWrapperService: EventEmitterWrapperService;

    public async onModuleInit() {
        this._eventEmitterWrapperService.payGatewayInputEventEmitterWrapper.onSuccessPay(this.onSuccessPay);
    }

    public async topUpAccount(accountTopUpInput: ITopUpAccountInput): Promise<ITopUpAccountOutput> {
        const exchangeRateWrapper = await this._exchangeRateService.getExchangeRateWrapper();

        /** Курс рубля */
        const exchangeRate_rub = exchangeRateWrapper.getExchangeRateSteamByCurrencyTypeForce(CurrencyType.Rub);
        /** Курс дол */
        const exchangeRate_usd = exchangeRateWrapper.getExchangeRateSteamByCurrencyTypeForce(CurrencyType.Usd);

        assertIsDefined(exchangeRate_rub, "exchangeRate_rub is not defined!");
        assertIsDefined(exchangeRate_usd, "exchangeRate_usd is not defined!");

        const {
            _topUpAccountConfigService: {
                topUpAccountConfigBackend: topUpAccountConfig,
            },
        } = this;

        const {
            serviceLocalId: _serviceLocalId,
            email,
            account,
            amount: amount_beforeOutput,
            currencyType: clientCurrencyType,
            description,
        } = accountTopUpInput;

        checkLimitersAmountAndConditionalThrowError({
            currencyType: clientCurrencyType,
            topUpAccountConfig,
            amount: amount_beforeOutput,
            isThrowError: true,
        });

        let table_shopTransaction: ITable_ShopTransaction_Output | undefined;

        {
            const {
                sqlRequest: transactionsPalychBillCreate_sqlRequest,
                values: transactionsPalychBillCreate_sqlRequestValues,
            } = SqlRequestsGetter.create__shopTransaction({
                user_id: null,
                // todo: заполнить информацию о жизненном цикле транзакции и поддержать до конца
                status_id: 3,
                // todo: заполнить информацию о жизненном цикле транзакции и поддержать до конца
                progress_id: 4,
                error_code_id: null,
                error_reason_code_id: null,
            });

            table_shopTransaction = await pgQueryAndNormaliseResponse<ITable_ShopTransaction_Output>(
                this._pool,
                transactionsPalychBillCreate_sqlRequest,
                transactionsPalychBillCreate_sqlRequestValues,
            );

            assertIsDefined(table_shopTransaction, "table_shopTransaction is not defined!");
        }

        // Заполняем таблицу ShopTransactionUserInfo
        {
            const {
                sqlRequest: transactionsPalychBillCreate_sqlRequest,
                values: transactionsPalychBillCreate_sqlRequestValues,
            } = SqlRequestsGetter.create__shopTransactionUserInfo({
                email,
                shop_transaction_id: table_shopTransaction.id,
            });

            await pgQueryAndNormaliseResponse<ITable_ShopTransactionUserInfo_Output>(
                this._pool,
                transactionsPalychBillCreate_sqlRequest,
                transactionsPalychBillCreate_sqlRequestValues,
            );
        }

        const exchange_rate_client = exchangeRateWrapper.getExchangeRateSteamByCurrencyTypeForce(clientCurrencyType);

        assertIsDefined(exchange_rate_client, "exchange_rate_client is not defined!");

        /** Клиент пополнит интерхаб в $ */
        const amount_output = convertCurrencyAmount({
            amount: amount_beforeOutput,
            exchangeRateUsdFrom: exchange_rate_client.value,
            exchangeRateUsdTo: exchangeRate_usd.value,
        });

        const serviceLocalId = _serviceLocalId as TopUpAccounts_ServiceLocalIdentifiers;
        // применяем комиссию
        const amountWithOurCommissionClientCurrency = getAmountWithOurCommission({
            amountRaw: amount_beforeOutput,
            currencyType: clientCurrencyType,
            topUpAccountConfig,
        });

        /*
         Нет никакого смысла в том, что бы проверять проверенное,
         но давай ещё раз прям проверим то, что пойдёт в interhub,
         на всякий случай, ок?
        */
        checkLimitersAmountAndConditionalThrowError({
            currencyType: CurrencyType.Usd,
            topUpAccountConfig,
            amount: amount_output,
            isThrowError: true,
        });

        await this._payGatewayWrapperService.savePay({
            account,
            serviceLocalId,
            amount: amount_output,
            transactionId: table_shopTransaction.id,
        });

        /** Общая сумма в RUB например, которая пойдёт к нам (в Palych например) */
        const amount_input = convertCurrencyAmount({
            amount: amountWithOurCommissionClientCurrency.value,
            exchangeRateUsdFrom: exchange_rate_client.value,
            exchangeRateUsdTo: exchangeRate_rub.value,
        });

        const linksPayInfo = await this._payGatewayWrapperService.createBill({
            amount: amount_input,
            transactionId: table_shopTransaction.id,
            clientEmail: email,
        });

        const currencyTypeDatabaseForExchangeRate_beforeOutput = await DataBaseUtils.getCurrencyType(exchange_rate_client.type, {
            pool: this._pool,
        });
        const currencyTypeDatabaseForExchangeRate_input = await DataBaseUtils.getCurrencyType(exchangeRate_rub.type, {
            pool: this._pool,
        });
        const currencyTypeDatabaseForExchangeRate_output = await DataBaseUtils.getCurrencyType(
            // Сейчас в interhub всё идёт только в $, если это изменится, то придётся разхардкодить и написать доп. логику
            CurrencyType.Usd,
            {
            pool: this._pool,
        });

        assertIsDefined(currencyTypeDatabaseForExchangeRate_beforeOutput, "currencyTypeDatabaseForExchangeRate_beforeOutput is not defined");
        assertIsDefined(currencyTypeDatabaseForExchangeRate_input, "currencyTypeDatabaseForExchangeRate_input is not defined");
        assertIsDefined(currencyTypeDatabaseForExchangeRate_output, "currencyTypeDatabaseForExchangeRate_output is not defined");

        const {
            sqlRequest: transactionsPalychBillCreate_sqlRequest,
            values: transactionsPalychBillCreate_sqlRequestValues,
        } = SqlRequestsGetter.create__shopTransactionInfo({
            pay_gateway_before_output_currency_type_id: currencyTypeDatabaseForExchangeRate_beforeOutput.id,
            pay_gateway_before_output_exchange_rate: exchange_rate_client.value,
            pay_gateway_before_output_amount: amount_beforeOutput,
            pay_gateway_input_currency_type_id: currencyTypeDatabaseForExchangeRate_input.id,
            pay_gateway_input_exchange_rate: exchangeRate_rub.value,
            pay_gateway_input_amount: amount_input,
            pay_gateway_output_currency_type_id: currencyTypeDatabaseForExchangeRate_output.id,
            // Сейчас с interhub работаем в $, а значит $/$ = 1 (один это и есть курс доллара у доллара)
            pay_gateway_output_exchange_rate: 1,
            pay_gateway_output_amount: amount_output,
            description: description ?? null,
            // todo: id транзакции
            shop_transaction_id: table_shopTransaction.id,
            commission_rate: amountWithOurCommissionClientCurrency.commissionRateValue,
        });

        await pgQueryAndNormaliseResponse<ITable_ShopTransactionInfo_Output>(
            this._pool,
            transactionsPalychBillCreate_sqlRequest,
            transactionsPalychBillCreate_sqlRequestValues,
        );

        return {
            linkPagePay: linksPayInfo.linkPagePay,
            linkPagePayWithQRCode: linksPayInfo.linkPagePayWithQRCode,
            eventId: `topUpAccountNotificationPrefix-${table_shopTransaction.id}`,
        };
    }

    public onSuccessPay = async (eventData: IEventEmitterWrapper.PayGatewayInputSuccessEventData) => {
        const {
            transactionId,
            billId,
            amount: payGatewayInputAmount,
        } = eventData;

        const {
            sqlRequest: find_table_ShopTransaction_sqlRequest,
            values: find_table_ShopTransaction_sqlRequestValues,
        } = SqlRequestsGetter.findOne(TableNames.ShopTransaction, {
            where: {
                value: transactionId,
                name: Table_ShopTransaction_Columns.Id,
            },
        });

        const table_ShopTransaction_Output = await pgQueryAndNormaliseResponse<ITable_ShopTransaction_Output>(
            this._pool,
            find_table_ShopTransaction_sqlRequest,
            find_table_ShopTransaction_sqlRequestValues,
        );

        assertIsDefined(table_ShopTransaction_Output, `No table_ShopTransaction_Output ${table_ShopTransaction_Output}`);

        const table_PayGatewayOutputInterhubCheckRequestData_Output = await this._payGatewayWrapperService.pay({
            transactionId,
        });

        /*
            todo:
                1. статус транзакции выставить
                3. кинуть ивент в GUI
        */
        // todo: воскресить уведомление на фронтенд (ком код ниже)

        const {
            account,
            service_id,
            amount,
            agent_transaction_id,
            pay_gateway_output_interhub_id,
        } = table_PayGatewayOutputInterhubCheckRequestData_Output;

        // todo: пока хардкоднул, надо будет это динамически брать откуда надо
        const labelByExchangeType_output = getLabelByExchangeType({ externalType: CurrencyType.Usd });
        const labelByExchangeType_input = getLabelByExchangeType({ externalType: CurrencyType.Rub });
        const serviceTopUpLabelName = getLabelByServiceId({ serviceLocalId: TopUpAccounts_ServiceLocalIdentifiers.Steam });

        topUpsEmitPalychPostbackNotificationEvent({
            eventId: `topUpAccountNotificationPrefix-${transactionId}`,
            message: `Аккаунт в ${serviceTopUpLabelName} пополнен на: ${amount} ${labelByExchangeType_output}, за ${payGatewayInputAmount} ${labelByExchangeType_input}`,
        });
        // todo: шифровать ключ и расшифровывать, а не голый юзать из бд
    };
}
