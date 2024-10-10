'use strict';

import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from "@nestjs/config";
import { Pool } from "pg";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import { lastValueFrom } from "rxjs";

import { assertIsDefined } from "@detools/type_guards/base";
import { CurrencyType } from "@deshopfrontend/src/utils/constants";
import { ExchangeTypes_Palych } from "@deshopfrontend/src/utils/topUpAccount/constants";
import {
    exchangeTypePalychToExchengeType,
    exchangeTypeToExchengeTypePalych,
} from "@deshopfrontend/src/utils/topUpAccount/topUpAccount";

import type { IBaseHttpPalych } from "../../../baseHttp/types/baseHttpPalych";
import type {
    ITable_PayGatewayInput_Output,
    ITable_PayGatewayInputPalych_Output,
    ITable_PayGatewayInputPalychCreateBillRequest_Output, ITable_PayGatewayInputPalychCreateBillResponse_Output,
    ITable_PayGatewayInputPalychPostbackNotification_Output,
} from "../../../topUpAccount/types/topUpAccount";
import { DATABASE_POOL } from "../../../database/database.module";
import { BaseHttpService } from "../../../baseHttp/baseHttp.service";
import {
    palych_createBillRequestUrl,
    PalychPostbackNotification_Statuses,
} from "../../../topUpAccount/types/constants";
import { IPalychService } from "./types/palych.service";
import { pgQueryAndNormaliseResponse, SqlRequestsGetter } from "../../../topUpAccount/utils/sqlRequsts";
import {
    Table_PayGatewayInput_Columns, Table_PayGatewayInputPalych_Columns,
    Table_PayGatewayInputPalychCreateBill_Request_Columns,
    TableNames,
} from "../../../topUpAccount/utils/types/sqlRequests";

@Injectable()
export class PalychService {
    @Inject(DATABASE_POOL)
    private readonly _pool: Pool;
    private readonly _palychToken: string;
    private readonly _palychShopId: string;

    constructor(
        private readonly _configService: ConfigService,
        private readonly _httpService: BaseHttpService,
    ) {
        const palychToken = this._configService.get<string>('PALYCH_TOKEN');
        const palychShopId = this._configService.get<string>('PALYCH_SHOP_ID');

        assertIsDefined(palychToken, "palychToken is not defined!");
        assertIsDefined(palychShopId, "palychShopId is not defined!");

        this._palychToken = palychToken;
        this._palychShopId = palychShopId;
    }

    public async createBill(options: IPalychService.ICreateBillOptions): Promise<{
        linkPagePay: string,
        linkPagePayWithQRCode: string,
        billId: string,
    }> {
        const {
            amount,
            payGatewayInputPalychId,
        } = options;

        const palychBillCreateData_request: IBaseHttpPalych.RequestBillCreateData = {
            amount,
            shop_id: this._palychShopId,
            order_id: `${Date.now()}-${amount}`,
            currency_in: exchangeTypeToExchengeTypePalych(CurrencyType.Rub),
        };

        // Заполняем таблицу ITable_PayGatewayInputPalychCreateBillRequest_Output
        {
            const {
                sqlRequest: transactionsPalychBillCreateRequest_sqlRequest,
                values: transactionsPalychBillCreateRequest_sqlRequestValues,
            } = SqlRequestsGetter.create__payGatewayInputPalychCreateBillRequest({
                order_id: palychBillCreateData_request.order_id ?? null,
                shop_id: palychBillCreateData_request.shop_id,
                description: palychBillCreateData_request.description ?? null,
                type: palychBillCreateData_request.type ?? null,
                custom: palychBillCreateData_request.custom ?? null,
                name: palychBillCreateData_request.name ?? null,
                payer_email: palychBillCreateData_request.payer_email ?? null,
                payer_pays_commission: palychBillCreateData_request.payer_pays_commission ?? null,
                amount: palychBillCreateData_request.amount,
                currency_type: palychBillCreateData_request.currency_in ?? null,
                pay_gateway_input_palych_id: payGatewayInputPalychId,
            });

            await pgQueryAndNormaliseResponse<ITable_PayGatewayInputPalychCreateBillRequest_Output>(
                this._pool,
                transactionsPalychBillCreateRequest_sqlRequest,
                transactionsPalychBillCreateRequest_sqlRequestValues,
            );
        }

        const palychCreateBill__config: AxiosRequestConfig = { headers: { Authorization: this._palychToken } };
        const palychCreateBill__promiseRaw = this._httpService.post<IBaseHttpPalych.ResponseBillCreateData>(
            palych_createBillRequestUrl,
            palychBillCreateData_request,
            palychCreateBill__config,
        );

        const palychBillCreateData_response = await lastValueFrom<AxiosResponse<
            IBaseHttpPalych.ResponseBillCreateData
        >>(palychCreateBill__promiseRaw).catch(error => {
            console.error("Palych cant send post for create bill!");
            console.error("palych_createBillRequestUrl", palych_createBillRequestUrl);
            console.error("palychBillCreateData_request", palychBillCreateData_request);
            console.error("palychCreateBill__config", palychCreateBill__config);

            throw error;
        });

        const {
            data: {
                success: palychCreateBillResponse__success,
                bill_id: palychCreateBillResponse__bill_id,
                link_page_url: palychCreateBillResponse__link_page_url,
                link_url: palychCreateBillResponse__link_url,
            },
        } = palychBillCreateData_response;

        // Заполняем таблицу ITable_PayGatewayInputPalychCreateBillResponse_Output
        {
            const {
                sqlRequest: transactionsPalychBillCreateResponse_sqlRequest,
                values: transactionsPalychBillCreateResponse_sqlRequestValues,
            } = SqlRequestsGetter.create__payGatewayInputPalychCreateBillResponse({
                bill_id: palychCreateBillResponse__bill_id,
                is_success: palychCreateBillResponse__success,
                link_page_url: palychCreateBillResponse__link_page_url,
                link_url: palychCreateBillResponse__link_url,
                pay_gateway_input_palych_id: payGatewayInputPalychId,
            });

            await pgQueryAndNormaliseResponse<ITable_PayGatewayInputPalychCreateBillResponse_Output>(
                this._pool,
                transactionsPalychBillCreateResponse_sqlRequest,
                transactionsPalychBillCreateResponse_sqlRequestValues,
            );
        }

        if (!palychCreateBillResponse__success) {
            throw new Error(`Can't create palych bill! Bill id: ${palychCreateBillResponse__bill_id}`);
        }

        assertIsDefined(palychBillCreateData_request.order_id, "palychBillCreateData_request.order_id is not defined!");

        return {
            linkPagePay: palychCreateBillResponse__link_page_url,
            linkPagePayWithQRCode: palychCreateBillResponse__link_url,
            billId: palychCreateBillResponse__bill_id,
        };
    }

    public async onPostbackNotification(options: IPalychService.IPostbackNotificationOptions): Promise<
        IPalychService.IPostbackNotificationResult
    > {
        const {
            AccountType: accountType,
            BalanceAmount: balanceAmount,
            BalanceCurrency: balanceCurrency,
            Commission: commission,
            custom: custom,
            InvId: invId,
            OutSum: outSum,
            Currency: currency,
            CurrencyIn: currencyIn,
            Status: palychPostbackPaymentNotification__status,
            TrsId: trsId,
            SignatureValue: signatureValue,
            AccountNumber: accountNumber,
            ErrorCode: errorCode,
            ErrorMessage: errorMessage,
        } = options;

        let table_transactionsPalychBillCreate_Output: ITable_PayGatewayInputPalychCreateBillRequest_Output | undefined = void 0;

        // получили таблицу BillCreate по признаку invId (он же order_id)
        {
            const {
                sqlRequest: transactionsPalychBillCreate_sqlRequest,
                values: transactionsPalychBillCreate_sqlRequestValues,
            } = SqlRequestsGetter.findOne(TableNames.PayGatewayInputPalychCreateBillRequest, {
                where: {
                    value: invId,
                    name: Table_PayGatewayInputPalychCreateBill_Request_Columns.OrderId,
                },
            });

            table_transactionsPalychBillCreate_Output = await pgQueryAndNormaliseResponse<ITable_PayGatewayInputPalychCreateBillRequest_Output>(
                this._pool,
                transactionsPalychBillCreate_sqlRequest,
                transactionsPalychBillCreate_sqlRequestValues,
            );

            assertIsDefined(table_transactionsPalychBillCreate_Output, `Can't find table_transactionsPalychBillCreate_Output for this postback! Postback invId is: ${invId}`);
        }

        let table_payGatewayInputPalych_Output: ITable_PayGatewayInputPalych_Output | undefined = void 0;

        // получаем таблицу PayGatewayInputPalych
        {
            const {
                pay_gateway_input_palych_id,
            } = table_transactionsPalychBillCreate_Output;

            const {
                sqlRequest: payGatewayInputPalych_sqlRequest,
                values: payGatewayInputPalych_sqlRequestValues,
            } = SqlRequestsGetter.findOne(TableNames.PayGatewayInputPalych, {
                where: {
                    value: pay_gateway_input_palych_id,
                    name: Table_PayGatewayInputPalych_Columns.Id,
                },
            });

            table_payGatewayInputPalych_Output = await pgQueryAndNormaliseResponse<ITable_PayGatewayInputPalych_Output>(
                this._pool,
                payGatewayInputPalych_sqlRequest,
                payGatewayInputPalych_sqlRequestValues,
            );

            assertIsDefined(table_payGatewayInputPalych_Output, `Can't find table_payGatewayInputPalych_Output for this postback! Postback id is: ${trsId}`);
        }

        // вставили строку в таблицу postback notifications
        {
            const {
                sqlRequest: transactionsPalychPostbackNotification_sqlRequest,
                values: transactionsPalychPostbackNotification_sqlRequestValues,
            } = SqlRequestsGetter.create__payGatewayInputPalychPostbackNotification({
                // связь с таблицей BillCreate обеспечиваем здесь
                order_id: invId,
                out_sum: outSum,
                currency_in: currencyIn ?? null,
                commission,
                currency: currency ?? null,
                trsId,
                status: palychPostbackPaymentNotification__status,
                custom: custom ?? null,
                account_number: accountNumber,
                account_type: accountType,
                balance_amount: balanceAmount,
                balance_currency: balanceCurrency ?? null,
                error_code: errorCode ?? null,
                error_message: errorMessage ?? null,
                signature_value: signatureValue,
                pay_gateway_input_palych_id: table_payGatewayInputPalych_Output.id,
            });

            await pgQueryAndNormaliseResponse<ITable_PayGatewayInputPalychPostbackNotification_Output>(
                this._pool,
                transactionsPalychPostbackNotification_sqlRequest,
                transactionsPalychPostbackNotification_sqlRequestValues,
            );
        }

        checkStatusPostbackNotification(palychPostbackPaymentNotification__status as PalychPostbackNotification_Statuses, trsId);
        // todo: шифровать ключ и расшифровывать, а не голый юзать из бд

        let table_payGatewayInput_Output: ITable_PayGatewayInput_Output | undefined = void 0;

        // получаем таблицу PayGatewayInput
        {
            const {
                pay_gateway_input_id,
            } = table_payGatewayInputPalych_Output;

            const {
                sqlRequest: payGatewayInput_sqlRequest,
                values: payGatewayInput_sqlRequestValues,
            } = SqlRequestsGetter.findOne(TableNames.PayGatewayInput, {
                where: {
                    value: pay_gateway_input_id,
                    name: Table_PayGatewayInput_Columns.Id,
                },
            });

            table_payGatewayInput_Output = await pgQueryAndNormaliseResponse<ITable_PayGatewayInput_Output>(
                this._pool,
                payGatewayInput_sqlRequest,
                payGatewayInput_sqlRequestValues,
            );

            assertIsDefined(table_payGatewayInput_Output, `Can't find table_payGatewayInput_Output for this postback! Postback id is: ${trsId}`);
        }

        const {
            shop_transaction_id: transactionId,
        } = table_payGatewayInput_Output;

        return {
            transactionId,
            billId: invId,
            amount: outSum,
        };
    }
}

function checkStatusPostbackNotification(
    status: PalychPostbackNotification_Statuses,
    internalId: string,
    options?: { handleErrorCallback?: (errorText: string) => void },
): void {
    const {
        handleErrorCallback = () => void 0,
    } = options || {};

    switch (status) {
        case PalychPostbackNotification_Statuses.Overpaid: {
            break;
        }
        case PalychPostbackNotification_Statuses.Success: {
            break;
        }
        case PalychPostbackNotification_Statuses.Underpaid: {
            const errorText = `Underpaid - postback notification! Postback id is: ${internalId}`;

            handleErrorCallback(errorText);

            throw new Error(errorText);
        }
        case PalychPostbackNotification_Statuses.Fail: {
            const errorText = `Fail - postback notification! Postback id is: ${internalId}`;

            handleErrorCallback(errorText);

            throw new Error(errorText);
        }
        default: {
            const errorText = `Unknown status - postback notification! Postback id is: ${internalId}`;

            handleErrorCallback(errorText);

            throw new Error(errorText);
        }
    }
}

