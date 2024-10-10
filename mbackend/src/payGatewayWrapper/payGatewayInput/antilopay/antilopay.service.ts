'use strict';

import type {
    IAntilopayService,
    ITable_PayGatewayInputAntilopayCreateBillRequest_Output,
    ITable_PayGatewayInputAntilopayCreateBillResponse_Output,
    ITable_PayGatewayInputAntilopayPostbackNotification_Output,
} from "./types/antilopay.service";
import type {
    ITable_PayGatewayInput_Output, ITable_PayGatewayInputAntilopay_Output,
    ITable_PayGatewayInputPalych_Output,
} from "../../../topUpAccount/types/topUpAccount";

import { Pool } from "pg";
import { AxiosResponse } from "axios";
import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { PayGatewayInputAntilopayUtils } from "./utils";
import { BaseHttpService } from "../../../baseHttp/baseHttp.service";
import { pgQueryAndNormaliseResponse, SqlRequestsGetter } from "../../../topUpAccount/utils/sqlRequsts";
import { antilopay_createBillRequestUrl } from "../../../topUpAccount/types/constants";
import { lastValueFrom } from "rxjs";
import { assertIsDefined } from "@detools/type_guards/base";
import {
    Table_PayGatewayInput_Columns,
    Table_PayGatewayInputAntilopay_Columns,
    Table_PayGatewayInputAntilopayCreateBill_Response_Columns,
    TableNames,
} from "../../../topUpAccount/utils/types/sqlRequests";
import { Antilopay_CurrencyType, Antilopay_PayStatusCode, Antilopay_RequestResultCodeType } from "./types/constants";
import { DATABASE_POOL } from "../../../database/database.module";
import { TIME } from "@detools/common/polifils/DateTools_types.constants";

@Injectable()
export class AntilopayService {
    @Inject(DATABASE_POOL)
    private readonly _pool: Pool;
    private _antilopayKeyForCallbackRequestsSignatureVerification: string;
    private _antilopaySecretId: string;
    private _antilopaySecretKey: string;
    private _antilopaySecretKeyForPayInput: string;
    private _antilopayProjectId: string;

    constructor(
        private readonly _httpService: BaseHttpService,
        private readonly _configService: ConfigService,
    ) {
        const antilopayKeyForCallbackRequestsSignatureVerification = this._configService.get<string>('ANTILOPAY_KEY_FOR_CALLBACK_REQUESTS_SIGNATURE_VERIFICATION');
        const antilopaySecretId = this._configService.get<string>('ANTILOPAY_SECRET_ID');
        const antilopaySecretKey = this._configService.get<string>('ANTILOPAY_SECRET_KEY');
        const antilopaySecretKeyForPayInput = this._configService.get<string>('ANTILOPAY_SECRET_KEY_FOR_PAY_INPUT');
        const antilopayProjectId = this._configService.get<string>('ANTILOPAY_PROJECT_ID');

        assertIsDefined(antilopayKeyForCallbackRequestsSignatureVerification, "palychToken is not defined!");
        assertIsDefined(antilopaySecretId, "antilopayKeyForCallbackRequestsSignatureVerification is not defined!");
        assertIsDefined(antilopaySecretKey, "antilopaySecretId is not defined!");
        assertIsDefined(antilopaySecretKeyForPayInput, "antilopaySecretKey is not defined!");
        assertIsDefined(antilopayProjectId, "antilopaySecretKeyForPayInput is not defined!");

        this._antilopayKeyForCallbackRequestsSignatureVerification = antilopayKeyForCallbackRequestsSignatureVerification;
        this._antilopaySecretId = antilopaySecretId;
        this._antilopaySecretKey = antilopaySecretKey;
        this._antilopaySecretKeyForPayInput = antilopaySecretKeyForPayInput;
        this._antilopayProjectId = antilopayProjectId;
    }

    public async createBill(options: IAntilopayService.ICreateBillMethodOptions): Promise<{
        linkPagePay: string,
        linkPagePayWithQRCode?: string,
        billId: string,
    }> {
        const {
            amount,
            payGatewayInputAntilopayId,
            customer,
        } = options;

        const createBillRequestData: IAntilopayService.CreateBillRequestData = {
            amount,
            project_identificator: this._antilopayProjectId,
            order_id: `${Date.now() + Math.floor(Math.random() * TIME.SECONDS)}`,
            currency: Antilopay_CurrencyType.RUB,
            product_name: "steam",
            product_type: "services",
            product_quantity: 1,
            vat: 0,
            description: "dessly",
            fail_url: "https://steam.dessly.net",
            customer: {
                email: customer.email,
            },
        };

        // Заполняем таблицу ITable_PayGatewayInputAntilopayCreateBillRequest_Output
        {
            const {
                sqlRequest: transactionsAntilopayBillCreateRequest_sqlRequest,
                values: transactionsAntilopayBillCreateRequest_sqlRequestValues,
            } = SqlRequestsGetter.create__payGatewayInputAntilopayCreateBill_Request({
                amount: createBillRequestData.amount,
                project_identificator: createBillRequestData.project_identificator,
                order_id: createBillRequestData.order_id,
                currency: createBillRequestData.currency,
                product_name: createBillRequestData.product_name,
                product_type: createBillRequestData.product_type,
                product_quantity: createBillRequestData.product_quantity ?? null,
                vat: createBillRequestData.vat ?? null,
                description: createBillRequestData.description ?? null,
                success_url: createBillRequestData.success_url ?? null,
                fail_url: createBillRequestData.fail_url ?? null,
                customer: JSON.stringify(createBillRequestData.customer),
                pay_gateway_input_antilopay_id: payGatewayInputAntilopayId,
            });

            await pgQueryAndNormaliseResponse<ITable_PayGatewayInputAntilopayCreateBillRequest_Output>(
                this._pool,
                transactionsAntilopayBillCreateRequest_sqlRequest,
                transactionsAntilopayBillCreateRequest_sqlRequestValues,
            );
        }

        const headers = PayGatewayInputAntilopayUtils.createHeader({
            payload: createBillRequestData,
            secretKey: this._antilopaySecretKey,
            secretId: this._antilopaySecretId,
        });

        const createBill__promiseRaw = this._httpService.post<IAntilopayService.ICreateBillResponseData>(
            antilopay_createBillRequestUrl,
            createBillRequestData,
            headers,
        );

        const createBillResponseData = await lastValueFrom<AxiosResponse<
            IAntilopayService.ICreateBillResponseData
        >>(createBill__promiseRaw).catch(error => {
            console.error("Antilopay cant send post for create bill!");
            console.error("antilopay_createBillRequestUrl", antilopay_createBillRequestUrl);
            console.error("createBillRequestData", createBillRequestData);
            console.error("headers", headers);

            throw error;
        });

        const {
            data: {
                error,
                payment_id,
                code,
                payment_url,
            },
        } = createBillResponseData;

        // Заполняем таблицу ITable_PayGatewayInputAntilopayCreateBillResponse_Output
        {
            const {
                sqlRequest: transactionsPalychBillCreateResponse_sqlRequest,
                values: transactionsPalychBillCreateResponse_sqlRequestValues,
            } = SqlRequestsGetter.create__payGatewayInputAntilopayCreateBill_Response({
                pay_gateway_input_antilopay_id: payGatewayInputAntilopayId,
                error: error ?? null,
                code,
                payment_url,
                payment_id,
            });

            await pgQueryAndNormaliseResponse<ITable_PayGatewayInputAntilopayCreateBillResponse_Output>(
                this._pool,
                transactionsPalychBillCreateResponse_sqlRequest,
                transactionsPalychBillCreateResponse_sqlRequestValues,
            );
        }

        if (code !== Antilopay_RequestResultCodeType.Success || error) {
            throw new Error(`Can't create bill for antilopay: ${JSON.stringify(createBillResponseData.data)}`);
        }

        return {
            linkPagePay: payment_url,
            billId: payment_id,
        };
    }

    public async onPostbackNotification(options: IAntilopayService.PostbackNotificationOptions): Promise<IAntilopayService.IPostbackNotificationMethodResult> {
        let table_antilopayCreateBillResponse_Output: ITable_PayGatewayInputAntilopayCreateBillResponse_Output | undefined = void 0;

        // получили таблицу BillCreate по признаку invId (он же order_id)
        {
            const {
                sqlRequest: transactionsAntilopayBillCreate_sqlRequest,
                values: transactionsAntilopayBillCreate_sqlRequestValues,
            } = SqlRequestsGetter.findOne(TableNames.PayGatewayInputAntilopayCreateBillResponse, {
                where: {
                    value: options.payment_id,
                    name: Table_PayGatewayInputAntilopayCreateBill_Response_Columns.PaymentId,
                },
            });

            table_antilopayCreateBillResponse_Output = await pgQueryAndNormaliseResponse<ITable_PayGatewayInputAntilopayCreateBillResponse_Output>(
                this._pool,
                transactionsAntilopayBillCreate_sqlRequest,
                transactionsAntilopayBillCreate_sqlRequestValues,
            );

            assertIsDefined(table_antilopayCreateBillResponse_Output, `Can't find table_antilopayCreateBillResponse_Output for this postback! Postback order_id is: ${options.order_id}`);
        }

        let table_payGatewayInputAntilopay_Output: ITable_PayGatewayInputAntilopay_Output | undefined = void 0;

        // получаем таблицу table_payGatewayInputAntilopay_Output
        {
            const {
                pay_gateway_input_antilopay_id,
            } = table_antilopayCreateBillResponse_Output;

            const {
                sqlRequest: payGatewayInputAntilopay_sqlRequest,
                values: payGatewayInputAntilopay_sqlRequestValues,
            } = SqlRequestsGetter.findOne(TableNames.PayGatewayInputAntilopay, {
                where: {
                    value: pay_gateway_input_antilopay_id,
                    name: Table_PayGatewayInputAntilopay_Columns.Id,
                },
            });

            table_payGatewayInputAntilopay_Output = await pgQueryAndNormaliseResponse<ITable_PayGatewayInputPalych_Output>(
                this._pool,
                payGatewayInputAntilopay_sqlRequest,
                payGatewayInputAntilopay_sqlRequestValues,
            );

            assertIsDefined(table_payGatewayInputAntilopay_Output, `Can't find table_payGatewayInputAntilopay_Output for this postback! Postback id is: ${options.order_id}`);
        }

        // вставили строку в таблицу postback notifications
        {
            const {
                sqlRequest: transactionsAntilopayPostbackNotification_sqlRequest,
                values: transactionsAntilopayPostbackNotification_sqlRequestValues,
            } = SqlRequestsGetter.create__payGatewayInputAntilopayPostbackNotification({
                type: options.type,
                payment_id: options.payment_id,
                order_id: options.order_id,
                ctime: options.ctime,
                amount: options.amount,
                original_amount: options.original_amount,
                fee: options.fee,
                status: options.status,
                currency: options.currency,
                product_name: options.product_name,
                description: options.description,
                pay_method: options.pay_method,
                pay_data: options.pay_data,
                customer_ip: options.customer_ip,
                customer_useragent: options.customer_useragent,
                customer: JSON.stringify(options.customer),
                pay_gateway_input_antilopay_id: table_payGatewayInputAntilopay_Output.id,
            });

            await pgQueryAndNormaliseResponse<ITable_PayGatewayInputAntilopayPostbackNotification_Output>(
                this._pool,
                transactionsAntilopayPostbackNotification_sqlRequest,
                transactionsAntilopayPostbackNotification_sqlRequestValues,
            );
        }

        if (options.status !== Antilopay_PayStatusCode.SUCCESS) {
            console.error(JSON.stringify(options));

            throw new Error(`Not success pay postback notification ${options.status}`);
        }

        let table_payGatewayInput_Output: ITable_PayGatewayInput_Output | undefined = void 0;

        // получаем таблицу PayGatewayInput
        {
            const {
                pay_gateway_input_id,
            } = table_payGatewayInputAntilopay_Output;

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

            assertIsDefined(table_payGatewayInput_Output, `Can't find table_payGatewayInput_Output for this postback! Postback id is: ${options.order_id}`);
        }

        const {
            shop_transaction_id: transactionId,
        } = table_payGatewayInput_Output;

        return {
            transactionId,
            billId: options.payment_id,
            amount: options.amount,
        };
    }
}

