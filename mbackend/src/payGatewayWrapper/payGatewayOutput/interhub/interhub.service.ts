'use strict';

import type {
    ITable_PayGatewayOutputInterhub_Output,
    ITable_PayGatewayOutputInterhubCheckResponse_Output,
    ITable_PayGatewayOutputInterhubCheckRequest_Output,
    ITable_PayGatewayOutputInterhubPayResponse_Output, ITable_PayGatewayOutputInterhubPayRequest_Input,
} from "../../../topUpAccount/types/topUpAccount";

import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from "@nestjs/config";
import { Pool } from "pg";
import { lastValueFrom } from 'rxjs';
import { AxiosRequestConfig, AxiosResponse } from "axios";
import { assertIsDefined } from "@detools/type_guards/base";
import {
    accountTopUpInternalIdToLocalId,
    accountTopUpLocalIdToInternalId, checkLimitersAmountAndConditionalThrowError,
    exchangeTypeInterhubToExchengeType,
} from "@deshopfrontend/src/utils/topUpAccount/topUpAccount";

import { DATABASE_POOL } from "../../../database/database.module";
import { BaseHttpService } from "../../../baseHttp/baseHttp.service";
import { IBaseHttpInterhub } from "../../../baseHttp/types/baseHttpInterhub";
import { pgQueryAndNormaliseResponse, SqlRequestsGetter } from "../../../topUpAccount/utils/sqlRequsts";
import { interhub_checkRequestUrl, interhub_payRequestUrl } from "../../../topUpAccount/types/constants";
import { TopUpAccountConfigService } from "../../../topUpAccountConfig/topUpAccountConfig.service";
import { TopUpAccountConfigBackend } from "../../../topUpAccountConfig/TopUpAccountConfigServer/TopUpAccountConfigBackend";
import { IInterhubService } from "./types/interhub.service";
import {
    Table_PayGatewayOutputInterhub_Columns,
    Table_PayGatewayOutputInterhubCheckRequest_Columns,
    TableNames,
} from "../../../topUpAccount/utils/types/sqlRequests";
import { CurrencyType } from "@deshopfrontend/src/utils/constants";

@Injectable()
export class InterhubService {
    @Inject(DATABASE_POOL)
    private readonly _pool: Pool;
    @Inject(BaseHttpService)
    private readonly _httpService: BaseHttpService;
    @Inject(TopUpAccountConfigService)
    private _topUpAccountConfigService: TopUpAccountConfigService;
    private readonly _interhubToken: string;

    constructor(
        private _configService: ConfigService,
    ) {
        const interhubToken = this._configService.get<string>('INTERHUB_TOKEN');

        assertIsDefined(interhubToken, "interhubToken is not defined!");

        this._interhubToken = interhubToken;
    }

    public async saveCheckRequest(options: IInterhubService.SaveCheckMethodOptions) {
        const {
            amount,
            serviceLocalId,
            payGatewayOutputInterhubId,
            account,
        } = options;

        // Заполняем таблицу ITable_PayGatewayOutputInterhubCheckRequest_Output
        {
            const {
                sqlRequest: transactionsInterhubCheckRequestData_sqlRequest,
                values: transactionsInterhubCheckRequestData_sqlRequestValues,
            } = SqlRequestsGetter.create__payGatewayOutputInterhubCheckRequest({
                account,
                service_id: accountTopUpLocalIdToInternalId(serviceLocalId),
                amount,
                agent_transaction_id: `${Date.now()}-${accountTopUpLocalIdToInternalId(serviceLocalId)}-${amount}`,
                pay_gateway_output_interhub_id: payGatewayOutputInterhubId,
            });

            await pgQueryAndNormaliseResponse<ITable_PayGatewayOutputInterhubCheckRequest_Output>(
                this._pool,
                transactionsInterhubCheckRequestData_sqlRequest,
                transactionsInterhubCheckRequestData_sqlRequestValues,
            );
        }
    }

    private async _check(pay_gateway_output_interhub_id: number): Promise<ITable_PayGatewayOutputInterhubCheckRequest_Output> {
        let table_payGatewayOutputInterhubCheckRequestData: ITable_PayGatewayOutputInterhubCheckRequest_Output | undefined = void 0;

        // получаем строку из таблицы PayGatewayOutputInterhubCheckRequest
        {
            const {
                sqlRequest: transactionsInterhubCheckRequestData_sqlRequest,
                values: transactionsInterhubCheckRequestData_sqlRequestValues,
            } = SqlRequestsGetter.findOne(TableNames.PayGatewayOutputInterhubCheckRequest, {
                where: {
                    value: pay_gateway_output_interhub_id,
                    name: Table_PayGatewayOutputInterhubCheckRequest_Columns.PayGatewayOutputInterhubId,
                },
            });

            table_payGatewayOutputInterhubCheckRequestData = await pgQueryAndNormaliseResponse<ITable_PayGatewayOutputInterhubCheckRequest_Output>(
                this._pool,
                transactionsInterhubCheckRequestData_sqlRequest,
                transactionsInterhubCheckRequestData_sqlRequestValues,
            );

            assertIsDefined(
                table_payGatewayOutputInterhubCheckRequestData,
                `Can't find table_transactionsInterhubCheckRequestData row! payGatewayOutputInterhubId id is: ${pay_gateway_output_interhub_id}`,
            );
        }

        const interhubRequestCheckData: IBaseHttpInterhub.RequestCheckData = {
            account: table_payGatewayOutputInterhubCheckRequestData.account,
            agent_transaction_id: table_payGatewayOutputInterhubCheckRequestData.agent_transaction_id,
            amount: table_payGatewayOutputInterhubCheckRequestData.amount,
            service_id: table_payGatewayOutputInterhubCheckRequestData.service_id,
        };

        // И всё же, на всякий случай ещё раз проверим!
        checkLimitersAmountAndConditionalThrowError({
            currencyType: CurrencyType.Usd,
            topUpAccountConfig: this._topUpAccountConfigService.topUpAccountConfigBackend,
            amount: interhubRequestCheckData.amount,
            isThrowError: true,
        });

        const interhubCheck__config: AxiosRequestConfig = { headers: { token: this._interhubToken } };
        const interhubCheck_rawPromise = this._httpService.post<IBaseHttpInterhub.ResponseCheckData>(
            interhub_checkRequestUrl,
            interhubRequestCheckData,
            interhubCheck__config,
        );

        const interhubCheckResponseDataWrapper = await lastValueFrom<AxiosResponse<
            IBaseHttpInterhub.ResponseCheckData
        >>(interhubCheck_rawPromise).catch(error => {
            console.error("Interhub can't send post for check!");
            console.error("interhub_checkRequestUrl", interhub_checkRequestUrl);
            console.error("interhubRequestCheckData", interhubRequestCheckData);
            console.error("interhubCheck__config", interhubCheck__config);

            throw error;
        });

        const {
            data: {
                account: interhubCheckResponse__account,
                amount: interhubCheckResponse__amount,
                comission: interhubCheckResponse__comission,
                status: interhubCheckResponse__status,
                success: interhubCheckResponse__success,
                message: interhubCheckResponse__message,
                currency: interhubCheckResponse__currency,
                transaction_id: interhubCheckResponse__transaction_id,
                amount_in_currency: interhubCheckResponse__amount_in_currency,
            },
        } = interhubCheckResponseDataWrapper;

        if (!interhubCheckResponse__success) {
            console.error("account", interhubCheckResponse__account);
            console.error("amount", interhubCheckResponse__amount);
            console.error("comission", interhubCheckResponse__comission);
            console.error("status", interhubCheckResponse__status);
            console.error("IsSuccess", interhubCheckResponse__success);
            console.error("message", interhubCheckResponse__message);
            console.error("currency", interhubCheckResponse__currency);
            console.error("transaction_id", interhubCheckResponse__transaction_id);
            console.error("amount_in_currency", interhubCheckResponse__amount_in_currency);

            throw new Error("Interhub transaction check failed");
        }

        let table_transactionsInterhubCheck: ITable_PayGatewayOutputInterhubCheckResponse_Output | undefined = void 0;

        // Заполняем таблицу ITable_PayGatewayOutputInterhubCheck_Output
        {
            const {
                sqlRequest: transactionsInterhubCheck_sqlRequest,
                values: transactionsInterhubCheck_sqlRequestValues,
            } = SqlRequestsGetter.create__payGatewayOutputInterhubCheckResponse({
                account: interhubCheckResponse__account,
                amount: interhubCheckResponse__amount,
                success: interhubCheckResponse__success,
                transaction_id: interhubCheckResponse__transaction_id,
                currency: interhubCheckResponse__currency ?? null,
                commission: interhubCheckResponse__comission,
                message: interhubCheckResponse__message,
                amount_in_currency: interhubCheckResponse__amount_in_currency,
                status: String(interhubCheckResponse__status),
                pay_gateway_output_interhub_id: pay_gateway_output_interhub_id,
            });

            table_transactionsInterhubCheck = await pgQueryAndNormaliseResponse<ITable_PayGatewayOutputInterhubCheckResponse_Output>(
                this._pool,
                transactionsInterhubCheck_sqlRequest,
                transactionsInterhubCheck_sqlRequestValues,
            );
        }

        assertIsDefined(
            table_transactionsInterhubCheck,
            `Can't find table_transactionsInterhubCheck row! payGatewayOutputInterhubId id is: ${pay_gateway_output_interhub_id}`,
        );

        return table_payGatewayOutputInterhubCheckRequestData;
    }

    public async pay(options: IInterhubService.PayMethodOptions): Promise<ITable_PayGatewayOutputInterhubCheckRequest_Output> {
        const {
            payGatewayOutputInterhubId: pay_gateway_output_interhub_id,
        } = options;

        const table_payGatewayOutputInterhubCheckRequestData = await this._check(pay_gateway_output_interhub_id);

        let table_payGatewayOutputInterhub: ITable_PayGatewayOutputInterhub_Output | undefined = void 0;

        // Получаем строку из таблицы ITable_PayGatewayOutputInterhub_Output
        {
            const {
                sqlRequest: payGatewayOutputInterhub_sqlRequest,
                values: payGatewayOutputInterhub_sqlRequestValues,
            } = SqlRequestsGetter.findOne(TableNames.PayGatewayOutputInterhub, {
                where: {
                    value: pay_gateway_output_interhub_id,
                    name: Table_PayGatewayOutputInterhub_Columns.Id,
                },
            });

            table_payGatewayOutputInterhub = await pgQueryAndNormaliseResponse<ITable_PayGatewayOutputInterhub_Output>(
                this._pool,
                payGatewayOutputInterhub_sqlRequest,
                payGatewayOutputInterhub_sqlRequestValues,
            );

            assertIsDefined(
                table_payGatewayOutputInterhub,
                `Can't find table_payGatewayOutputInterhub row! payGatewayOutputInterhubId id is: ${pay_gateway_output_interhub_id}`,
            );
        }

        // Заполняем таблицу ITable_PayGatewayOutputInterhubPayRequest_Input
        {
            const {
                sqlRequest: transactionsInterhubPayRequest_sqlRequest,
                values: transactionsInterhubPayRequest_sqlRequestValues,
            } = SqlRequestsGetter.create__payGatewayOutputInterhubPayRequest({
                agent_transaction_id: table_payGatewayOutputInterhubCheckRequestData.agent_transaction_id,
                pay_gateway_output_interhub_id,
            });

            await pgQueryAndNormaliseResponse<ITable_PayGatewayOutputInterhubPayRequest_Input>(
                this._pool,
                transactionsInterhubPayRequest_sqlRequest,
                transactionsInterhubPayRequest_sqlRequestValues,
            );
        }

        const interhubPayData_request: IBaseHttpInterhub.RequestPayData = {
            agent_transaction_id: table_payGatewayOutputInterhubCheckRequestData.agent_transaction_id,
        };

        const interhubPay_config: AxiosRequestConfig = { headers: { token: this._interhubToken } };

        const interhubPay_promiseRaw = this._httpService.post<
            IBaseHttpInterhub.ResponsePayData
        >(
            interhub_payRequestUrl,
            interhubPayData_request,
            interhubPay_config,
        );

        const interhubPayData_promise =  lastValueFrom<AxiosResponse<
            IBaseHttpInterhub.ResponsePayData
        >>(interhubPay_promiseRaw);

        const interhubPayData_response = await interhubPayData_promise.catch(error => {
            console.error("Interhub can't send post for pay!");
            console.error("interhub_payRequestUrl", interhub_payRequestUrl);
            console.error("interhubPayData_request", interhubPayData_request);
            console.error("interhubPay_config", interhubPay_config);

            throw error;
        });

        const {
            data: {
                data: interhubPayDataResponse__data,
                status: interhubPayDataResponse__status,
                success: interhubPayDataResponse__success,
                message: interhubPayDataResponse__message,
            },
        } = interhubPayData_response;

        // Заполняем таблицу ITable_PayGatewayOutputInterhubPayResponse_Output
        {
            const {
                sqlRequest: transactionsInterhubPay_sqlRequest,
                values: transactionsInterhubPay_sqlRequestValues,
            } = SqlRequestsGetter.create__payGatewayOutputInterhubPayResponse({
                data: JSON.stringify(interhubPayDataResponse__data) ?? null,
                success: interhubPayDataResponse__success,
                message: interhubPayDataResponse__message,
                // todo: проверить это
                error_code: typeof interhubPayDataResponse__status !== "string" ? interhubPayDataResponse__status : null,
                agent_transaction_id: table_payGatewayOutputInterhubCheckRequestData.agent_transaction_id,
                pay_gateway_output_interhub_id,
            });

            await pgQueryAndNormaliseResponse<ITable_PayGatewayOutputInterhubPayResponse_Output>(
                this._pool,
                transactionsInterhubPay_sqlRequest,
                transactionsInterhubPay_sqlRequestValues,
            );
        }

        return table_payGatewayOutputInterhubCheckRequestData;
    }
}
