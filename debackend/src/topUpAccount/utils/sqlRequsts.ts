'use strict';

import { Pool } from "pg";

// todo: во всех генераторах sql запросов нужно проверять входящие данные, что бы не прилетел хак в виде "where 1=1" вместо id например
import {
    ITable_ShopTransactionInfo_Input,
    ITable_ShopTransaction_Input,
    ITable_PayGatewayOutputInterhubCheckResponse_Input,
    ITable_PayGatewayOutputInterhubCheckRequestData_Input,
    ITable_PayGatewayOutputInterhubPayResponse_Input,
    ITable_PayGatewayInputPalychCreateBillRequest_Input,
    ITable_PayGatewayInputPalychPostbackNotification_Input,
    ITable_Users_Input,
    ITable_PayGatewayInputPalych_Input,
    ITable_PayGatewayInputAntilopay_Input,
    ITable_PayGatewayOutputInterhub_Input,
    ITable_PayGatewayInput_Input,
    ITable_PayGatewayOutput_Input,
    ITable_PayGatewayInputPalychCreateBillResponse_Input,
    ITable_PayGatewayOutputInterhubPayRequest_Input,
    ITable_ShopTransactionUserInfo_Input,
} from "../types/topUpAccount";
import {
    TableNames,
    Table_PayGatewayOutputInterhubCheckResponse_Columns,
    Table_ShopTransactionInfo_Columns,
    Table_PayGatewayInputPalychCreateBill_Request_Columns,
    Table_PayGatewayInputPalychPostbackNotification_Columns,
    Table_PayGatewayOutputInterhubCheckRequest_Columns,
    Table_PayGatewayOutputInterhubPayResponse_Columns,
    Table_ShopTransaction_Columns,
    Table_Users_Columns,
    Table_PayGatewayInputAntilopay_Columns,
    Table_PayGatewayInput_Columns,
    Table_PayGatewayOutput_Columns,
    Table_PayGatewayOutputInterhub_Columns,
    Table_PayGatewayInputPalych_Columns,
    Table_PayGatewayInputPalychCreateBill_Response_Columns,
    Table_PayGatewayInputAntilopayCreateBill_Request_Columns,
    Table_PayGatewayInputAntilopayCreateBill_Response_Columns,
    Table_PayGatewayInputAntilopayPostbackNotification_Columns,
    Table_PayGatewayOutputInterhubPayRequest_Columns,
    Table_ShopTransactionUserInfo_Columns,
} from "./types/sqlRequests";
import {
    ITable_PayGatewayInputAntilopayCreateBill_Request_Input,
    ITable_PayGatewayInputAntilopayCreateBill_Response_Input, ITable_PayGatewayInputAntilopayPostbackNotification_Input,
} from "../../payGatewayWrapper/payGatewayInput/antilopay/types/antilopay.service";
import { Antilopay_RequestResultCodeType } from "../../payGatewayWrapper/payGatewayInput/antilopay/types/constants";

export class SqlRequestsGetter {
    /** Запрос на создание ордера Palych */
    public static create__payGatewayInputPalychCreateBillRequest(input: ITable_PayGatewayInputPalychCreateBillRequest_Input): {
        sqlRequest: string,
        values: [
            string | null/*order_id*/,
            string/*shop_id*/,
            number/*amount*/,
            string | null/*currency_type*/,
            string | null/*description*/,
            number | null /* payer_pays_commission */,
            string | null /* type */,
            string | null /* custom */,
            string | null /* name */,
            string | null /* payer_email */,
            number /* pay_gateway_input_palych_id */,
        ],
    } {
        const {
            order_id,
            shop_id,
            amount,
            currency_type,
            description,
            payer_pays_commission,
            type,
            custom,
            name,
            payer_email,
            pay_gateway_input_palych_id,
        } = input;

        // todo: прогонять через нормалайзер что бы везде было RETURNING *
        return {
            sqlRequest: `INSERT INTO ${TableNames.PayGatewayInputPalychCreateBillRequest} (${Table_PayGatewayInputPalychCreateBill_Request_Columns.OrderId}, ${Table_PayGatewayInputPalychCreateBill_Request_Columns.ShopId}, ${Table_PayGatewayInputPalychCreateBill_Request_Columns.Amount}, ${Table_PayGatewayInputPalychCreateBill_Request_Columns.CurrencyType}, ${Table_PayGatewayInputPalychCreateBill_Request_Columns.Description}, ${Table_PayGatewayInputPalychCreateBill_Request_Columns.PayerPaysCommission}, ${Table_PayGatewayInputPalychCreateBill_Request_Columns.Type}, ${Table_PayGatewayInputPalychCreateBill_Request_Columns.Custom}, ${Table_PayGatewayInputPalychCreateBill_Request_Columns.Name}, ${Table_PayGatewayInputPalychCreateBill_Request_Columns.PayerEmail}, ${Table_PayGatewayInputPalychCreateBill_Request_Columns.PayGatewayInputPalychId}) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
            values: [
                order_id,
                shop_id,
                amount,
                currency_type,
                description,
                payer_pays_commission,
                type,
                custom,
                name,
                payer_email,
                pay_gateway_input_palych_id,
            ],
        };
    }

    /** Запрос на создание ордера Palych */
    public static create__payGatewayInputPalychCreateBillResponse(input: ITable_PayGatewayInputPalychCreateBillResponse_Input): {
        sqlRequest: string,
        values: [
            boolean/* is_success */,
            string/* bill_id */,
            string/* link_url */,
            string/* link_page_url */,
            number/* pay_gateway_input_palych_id */,
        ],
    } {
        const {
            is_success,
            bill_id,
            link_url,
            link_page_url,
            pay_gateway_input_palych_id,
        } = input;

        return {
            sqlRequest: `INSERT INTO ${TableNames.PayGatewayInputPalychCreateBillResponse} (
                ${Table_PayGatewayInputPalychCreateBill_Response_Columns.Success},
                ${Table_PayGatewayInputPalychCreateBill_Response_Columns.BillId},
                ${Table_PayGatewayInputPalychCreateBill_Response_Columns.LinkUrl},
                ${Table_PayGatewayInputPalychCreateBill_Response_Columns.LinkPageUrl},
                ${Table_PayGatewayInputPalychCreateBill_Response_Columns.PayGatewayInputPalychId}
            ) VALUES($1, $2, $3, $4, $5) RETURNING *`,
            values: [
                is_success,
                bill_id,
                link_url,
                link_page_url,
                pay_gateway_input_palych_id,
            ],
        };
    }

    /** Оплата Palych */
    public static create__payGatewayInputPalychPostbackNotification(input: ITable_PayGatewayInputPalychPostbackNotification_Input): {
        sqlRequest: string,
        values: [
            string/*order_id*/,
            number/*out_sum*/,
            string/*currency_in*/,
            number/*commission*/,
            string/*currency*/,
            string/*trsId*/,
            string/*status*/,
            string | null/*custom*/,
            string/*account_number*/,
            string/*account_type*/,
            number/*balance_amount*/,
            string/*balance_currency*/,
            number | null/*error_code*/,
            string | null/*error_message*/,
            string/*signature_value*/,
            number/*pay_gateway_input_palych_id*/,
        ],
    } {
        const {
            order_id,
            out_sum,
            currency_in,
            commission,
            currency,
            trsId,
            status,
            custom = null,
            account_number,
            account_type,
            balance_amount,
            balance_currency,
            error_code = null,
            error_message = null,
            signature_value,
            pay_gateway_input_palych_id,
        } = input;

        return {
            sqlRequest: `INSERT INTO ${TableNames.PayGatewayInputPalychPostbackNotification} (
                ${Table_PayGatewayInputPalychPostbackNotification_Columns.OrderId},
                ${Table_PayGatewayInputPalychPostbackNotification_Columns.OutSum},
                ${Table_PayGatewayInputPalychPostbackNotification_Columns.CurrencyIn},
                ${Table_PayGatewayInputPalychPostbackNotification_Columns.Commission},
                ${Table_PayGatewayInputPalychPostbackNotification_Columns.Currency},
                ${Table_PayGatewayInputPalychPostbackNotification_Columns.TrsId},
                ${Table_PayGatewayInputPalychPostbackNotification_Columns.Status},
                ${Table_PayGatewayInputPalychPostbackNotification_Columns.Custom},
                ${Table_PayGatewayInputPalychPostbackNotification_Columns.AccountNumber},
                ${Table_PayGatewayInputPalychPostbackNotification_Columns.AccountType},
                ${Table_PayGatewayInputPalychPostbackNotification_Columns.BalanceAmount},
                ${Table_PayGatewayInputPalychPostbackNotification_Columns.BalanceCurrency},
                ${Table_PayGatewayInputPalychPostbackNotification_Columns.ErrorCode},
                ${Table_PayGatewayInputPalychPostbackNotification_Columns.ErrorMessage},
                ${Table_PayGatewayInputPalychPostbackNotification_Columns.SignatureValue},
                ${Table_PayGatewayInputPalychPostbackNotification_Columns.PayGatewayInputPalychId}
              ) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) RETURNING *`,
            values: [
                order_id,
                out_sum,
                currency_in,
                commission,
                currency,
                trsId,
                status,
                custom,
                account_number,
                account_type,
                balance_amount,
                balance_currency,
                error_code,
                error_message,
                signature_value,
                pay_gateway_input_palych_id,
            ],
        };
    }

    /** Запрос на создание ордера Antilopay */
    public static create__payGatewayInputAntilopayCreateBill_Request(input: ITable_PayGatewayInputAntilopayCreateBill_Request_Input): {
        sqlRequest: string,
        values: [
            string/*project_identificator*/,
            number/*amount*/,
            string/*order_id*/,
            string/*currency*/,
            string/*product_name*/,
            string/*product_type*/,
            number | null/*product_quantity*/,
            number | null/*vat*/,
            string/*description*/,
            string | null/*success_url*/,
            string | null/*fail_url*/,
            string/*customer*/,
            number/*pay_gateway_input_antilopay_id*/,
        ],
    } {
        const {
            project_identificator,
            amount,
            order_id,
            currency,
            product_name,
            product_type,
            product_quantity,
            vat,
            description,
            success_url,
            fail_url,
            customer,
            pay_gateway_input_antilopay_id,
        } = input;

        return {
            sqlRequest: `INSERT INTO ${TableNames.PayGatewayInputAntilopayCreateBillRequest} (
                ${Table_PayGatewayInputAntilopayCreateBill_Request_Columns.ProjectIdentificator},
                ${Table_PayGatewayInputAntilopayCreateBill_Request_Columns.Amount},
                ${Table_PayGatewayInputAntilopayCreateBill_Request_Columns.OrderId},
                ${Table_PayGatewayInputAntilopayCreateBill_Request_Columns.Currency},
                ${Table_PayGatewayInputAntilopayCreateBill_Request_Columns.ProductName},
                ${Table_PayGatewayInputAntilopayCreateBill_Request_Columns.ProductType},
                ${Table_PayGatewayInputAntilopayCreateBill_Request_Columns.ProductQuantity},
                ${Table_PayGatewayInputAntilopayCreateBill_Request_Columns.Vat},
                ${Table_PayGatewayInputAntilopayCreateBill_Request_Columns.Description},
                ${Table_PayGatewayInputAntilopayCreateBill_Request_Columns.SuccessUrl},
                ${Table_PayGatewayInputAntilopayCreateBill_Request_Columns.FailUrl},
                ${Table_PayGatewayInputAntilopayCreateBill_Request_Columns.Customer},
                ${Table_PayGatewayInputAntilopayCreateBill_Request_Columns.PayGatewayInputAntilopayId}
          ) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *`,
            values: [
                project_identificator,
                amount,
                order_id,
                currency,
                product_name,
                product_type,
                product_quantity,
                vat,
                description,
                success_url,
                fail_url,
                customer,
                pay_gateway_input_antilopay_id,
            ],
        };
    }

    /** Запрос на создание ордера Antilopay */
    public static create__payGatewayInputAntilopayCreateBill_Response(input: ITable_PayGatewayInputAntilopayCreateBill_Response_Input): {
        sqlRequest: string,
        values: [
            number/*code*/,
            string/*payment_id*/,
            string/*payment_url*/,
            string | null/*error*/,
            number/*pay_gateway_input_antilopay_id*/,
        ],
    } {
        const {
            code,
            payment_id,
            payment_url,
            error,
            pay_gateway_input_antilopay_id,
        } = input;

        return {
            sqlRequest: `INSERT INTO ${TableNames.PayGatewayInputAntilopayCreateBillResponse} (
                ${Table_PayGatewayInputAntilopayCreateBill_Response_Columns.Code},
                ${Table_PayGatewayInputAntilopayCreateBill_Response_Columns.PaymentId},
                ${Table_PayGatewayInputAntilopayCreateBill_Response_Columns.PaymentUrl},
                ${Table_PayGatewayInputAntilopayCreateBill_Response_Columns.Error},
                ${Table_PayGatewayInputAntilopayCreateBill_Response_Columns.PayGatewayInputAntilopayId}
            ) VALUES($1, $2, $3, $4, $5) RETURNING *`,
            values: [
                code,
                payment_id,
                payment_url,
                error,
                pay_gateway_input_antilopay_id,
            ],
        };
    }

    /** Оплата Antilopay */
    public static create__payGatewayInputAntilopayPostbackNotification(input: ITable_PayGatewayInputAntilopayPostbackNotification_Input): {
        sqlRequest: string,
        values: [
            string/*type*/,
            string/*payment_id*/,
            string/*order_id*/,
            string/*ctime*/,
            number/*amount*/,
            number/*original_amount*/,
            number/*fee*/,
            string/*status*/,
            string/*currency*/,
            string/*product_name*/,
            string/*description*/,
            string/*pay_method*/,
            string/*pay_data*/,
            string/*customer_ip*/,
            string/*customer_useragent*/,
            string/*customer*/,
            number/*pay_gateway_input_antilopay_id*/,
        ],
    } {
        const {
            type,
            payment_id,
            order_id,
            ctime,
            amount,
            original_amount,
            fee,
            status,
            currency,
            product_name,
            description,
            pay_method,
            pay_data,
            customer_ip,
            customer_useragent,
            customer,
            pay_gateway_input_antilopay_id,
        } = input;

        return {
            sqlRequest: `INSERT INTO ${TableNames.PayGatewayInputAntilopayPostbackNotification} (
                ${Table_PayGatewayInputAntilopayPostbackNotification_Columns.Type},
                ${Table_PayGatewayInputAntilopayPostbackNotification_Columns.PaymentId},
                ${Table_PayGatewayInputAntilopayPostbackNotification_Columns.OrderId},
                ${Table_PayGatewayInputAntilopayPostbackNotification_Columns.Ctime},
                ${Table_PayGatewayInputAntilopayPostbackNotification_Columns.Amount},
                ${Table_PayGatewayInputAntilopayPostbackNotification_Columns.OriginalAmount},
                ${Table_PayGatewayInputAntilopayPostbackNotification_Columns.Fee},
                ${Table_PayGatewayInputAntilopayPostbackNotification_Columns.Status},
                ${Table_PayGatewayInputAntilopayPostbackNotification_Columns.Currency},
                ${Table_PayGatewayInputAntilopayPostbackNotification_Columns.ProductName},
                ${Table_PayGatewayInputAntilopayPostbackNotification_Columns.Description},
                ${Table_PayGatewayInputAntilopayPostbackNotification_Columns.PayMethod},
                ${Table_PayGatewayInputAntilopayPostbackNotification_Columns.PayData},
                ${Table_PayGatewayInputAntilopayPostbackNotification_Columns.CustomerIp},
                ${Table_PayGatewayInputAntilopayPostbackNotification_Columns.CustomerUseragent},
                ${Table_PayGatewayInputAntilopayPostbackNotification_Columns.Customer},
                ${Table_PayGatewayInputAntilopayPostbackNotification_Columns.PayGatewayInputAntilopayId}
             ) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) RETURNING *`,
            values: [
                type,
                payment_id,
                order_id,
                ctime,
                amount,
                original_amount,
                fee,
                status,
                currency,
                product_name,
                description,
                pay_method,
                pay_data,
                customer_ip,
                customer_useragent,
                customer,
                pay_gateway_input_antilopay_id,
            ],
        };
    }

    /** Interhub check */
    public static create__payGatewayOutputInterhubCheckRequest(input: ITable_PayGatewayOutputInterhubCheckRequestData_Input): {
        sqlRequest: string,
        values: [
            string/*agent_transaction_id*/,
            number/*amount*/,
            string/*account*/,
            number/*service_id*/,
            number/*pay_gateway_output_interhub_id*/,
        ],
    } {
        const {
            agent_transaction_id,
            amount,
            account,
            service_id,
            pay_gateway_output_interhub_id,
        } = input;

        // todo: прогонять через нормалайзер что бы везде было RETURNING *
        return {
            sqlRequest: `INSERT INTO ${TableNames.PayGatewayOutputInterhubCheckRequest} (
                ${Table_PayGatewayOutputInterhubCheckRequest_Columns.AgentTransactionId},
                ${Table_PayGatewayOutputInterhubCheckRequest_Columns.Amount},
                ${Table_PayGatewayOutputInterhubCheckRequest_Columns.Account},
                ${Table_PayGatewayOutputInterhubCheckRequest_Columns.ServiceId},
                ${Table_PayGatewayOutputInterhubCheckRequest_Columns.PayGatewayOutputInterhubId}
            ) VALUES($1, $2, $3, $4, $5) RETURNING *`,
            values: [
                agent_transaction_id,
                amount,
                account,
                service_id,
                pay_gateway_output_interhub_id,
            ],
        };
    }

    /** Interhub check */
    public static create__payGatewayOutputInterhubCheckResponse(input: ITable_PayGatewayOutputInterhubCheckResponse_Input): {
        sqlRequest: string,
        values: [
            number/*transaction_id*/,
            number/*amount*/,
            number/*commission*/,
            string/*account*/,
            string/*currency*/,
            boolean | null/*is_success*/,
            string | null/*message*/,
            number | null/*amount_in_currency*/,
            number/*pay_gateway_output_interhub_id*/,
        ],
    } {
        const {
            transaction_id,
            amount,
            commission,
            account,
            currency,
            success,
            message,
            amount_in_currency,
            pay_gateway_output_interhub_id,
        } = input;

        // todo: прогонять через нормалайзер что бы везде было RETURNING *
        return {
            sqlRequest: `INSERT INTO ${TableNames.PayGatewayOutputInterhubCheckResponse} (
                ${Table_PayGatewayOutputInterhubCheckResponse_Columns.TransactionId},
                ${Table_PayGatewayOutputInterhubCheckResponse_Columns.Amount},
                ${Table_PayGatewayOutputInterhubCheckResponse_Columns.Commission},
                ${Table_PayGatewayOutputInterhubCheckResponse_Columns.Account},
                ${Table_PayGatewayOutputInterhubCheckResponse_Columns.Currency},
                ${Table_PayGatewayOutputInterhubCheckResponse_Columns.Success},
                ${Table_PayGatewayOutputInterhubCheckResponse_Columns.Message},
                ${Table_PayGatewayOutputInterhubCheckResponse_Columns.AmountInCurrency},
                ${Table_PayGatewayOutputInterhubCheckResponse_Columns.PayGatewayOutputInterhubId}
           ) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
            values: [
                transaction_id,
                amount,
                commission,
                account,
                currency,
                success,
                message,
                amount_in_currency,
                pay_gateway_output_interhub_id,
            ],
        };
    }

    /** Запрос на создание ордера Interhub */
    public static create__payGatewayOutputInterhubPayRequest(input: ITable_PayGatewayOutputInterhubPayRequest_Input): {
        sqlRequest: string,
        values: [
            string/*agent_transaction_id*/,
            number/*pay_gateway_output_interhub_id*/,
        ],
    } {
        const {
            agent_transaction_id,
            pay_gateway_output_interhub_id,
        } = input;

        return {
            sqlRequest: `INSERT INTO ${TableNames.PayGatewayOutputInterhubPayRequest} (
                ${Table_PayGatewayOutputInterhubPayRequest_Columns.AgentTransactionId},
                ${Table_PayGatewayOutputInterhubPayRequest_Columns.PayGatewayOutputInterhubId}
            ) VALUES($1, $2) RETURNING *`,
            values: [
                agent_transaction_id,
                pay_gateway_output_interhub_id,
            ],
        };
    }

    /** Запрос на создание ордера Interhub */
    public static create__payGatewayOutputInterhubPayResponse(input: ITable_PayGatewayOutputInterhubPayResponse_Input): {
        sqlRequest: string,
        values: [
            string/*agent_transaction_id*/,
            string | null/*message*/,
            number | null/*errorCode*/,
            string | null/*data*/,
            boolean | null/*success*/,
            number/*pay_gateway_output_interhub_id*/,
        ],
    } {
        const {
            agent_transaction_id,
            message,
            error_code = null,
            data = null,
            success = null,
            pay_gateway_output_interhub_id,
        } = input;

        // todo: прогонять через нормалайзер что бы везде было RETURNING *
        return {
            sqlRequest: `INSERT INTO ${TableNames.PayGatewayOutputInterhubPayResponse} (
                ${Table_PayGatewayOutputInterhubPayResponse_Columns.AgentTransactionId},
                ${Table_PayGatewayOutputInterhubPayResponse_Columns.Message},
                ${Table_PayGatewayOutputInterhubPayResponse_Columns.ErrorCode},
                ${Table_PayGatewayOutputInterhubPayResponse_Columns.Data},
                ${Table_PayGatewayOutputInterhubPayResponse_Columns.Success},
                ${Table_PayGatewayOutputInterhubPayResponse_Columns.PayGatewayOutputInterhubId}
            ) VALUES($1, $2, $3, $4, $5, $6) RETURNING *`,
            values: [
                agent_transaction_id,
                message,
                error_code,
                data,
                success,
                pay_gateway_output_interhub_id,
            ],
        };
    }

    /** Запрос на создание пользователя */
    public static create__user(): {
        sqlRequest: string,
        values: [],
    } {
        return {
            sqlRequest: `INSERT INTO ${TableNames.Users} DEFAULT VALUES RETURNING *`,
            values: [],
        };
    }

    /** Запрос на создание пользователя */
    public static create__shopTransactionUserInfo(input: ITable_ShopTransactionUserInfo_Input): {
        sqlRequest: string,
        values: [
            string/*email*/,
            number/*shop_transaction_id*/,
        ],
    } {
        const {
            email,
            shop_transaction_id,
        } = input;

        return {
            sqlRequest: `INSERT INTO ${TableNames.ShopTransactionUserInfo} (
                ${Table_ShopTransactionUserInfo_Columns.Email},
                ${Table_ShopTransactionUserInfo_Columns.ShopTransactionId}
            ) VALUES($1, $2) RETURNING *`,
            values: [
                email,
                shop_transaction_id,
            ],
        };
    }

    public static create__shopTransactionInfo(input: ITable_ShopTransactionInfo_Input): {
        sqlRequest: string,
        values: [
            number/* commission_rate */,
            //
            number/* pay_gateway_before_output_currency_type_id */,
            number/* pay_gateway_before_output_exchange_rate */,
            number/* pay_gateway_before_output_amount */,
            //
            number/* pay_gateway_input_currency_type_id */,
            number/* pay_gateway_input_exchange_rate */,
            number/* pay_gateway_input_amount */,
            //
            number/* pay_gateway_output_currency_type_id */,
            number/* pay_gateway_output_exchange_rate */,
            number/* pay_gateway_output_amount */,
            //
            string | null/* description */,
            number/* shop_transaction_id */,
        ],
    } {
        const {
            commission_rate,
            //
            pay_gateway_before_output_currency_type_id,
            pay_gateway_before_output_exchange_rate,
            pay_gateway_before_output_amount,
            //
            pay_gateway_input_currency_type_id,
            pay_gateway_input_exchange_rate,
            pay_gateway_input_amount,
            //
            pay_gateway_output_currency_type_id,
            pay_gateway_output_exchange_rate,
            pay_gateway_output_amount,
            //
            description,
            shop_transaction_id,
        } = input;

        return {
            sqlRequest: `INSERT INTO ${TableNames.shopTransactionInfo} (
                    ${Table_ShopTransactionInfo_Columns.CommissionRate},
                    ${Table_ShopTransactionInfo_Columns.PayGatewayBeforeOutputCurrencyTypeId},
                    ${Table_ShopTransactionInfo_Columns.PayGatewayBeforeOutputExchangeRate},
                    ${Table_ShopTransactionInfo_Columns.PayGatewayBeforeOutputAmount},
                    ${Table_ShopTransactionInfo_Columns.PayGatewayInputCurrencyTypeId},
                    ${Table_ShopTransactionInfo_Columns.PayGatewayInputExchangeRate},
                    ${Table_ShopTransactionInfo_Columns.PayGatewayInputAmount},
                    ${Table_ShopTransactionInfo_Columns.PayGatewayOutputCurrencyTypeId},
                    ${Table_ShopTransactionInfo_Columns.PayGatewayOutputExchangeRate},
                    ${Table_ShopTransactionInfo_Columns.PayGatewayOutputAmount},
                    ${Table_ShopTransactionInfo_Columns.Description},
                    ${Table_ShopTransactionInfo_Columns.ShopTransactionId}
            ) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`,
            values: [
                commission_rate,
                //
                pay_gateway_before_output_currency_type_id,
                pay_gateway_before_output_exchange_rate,
                pay_gateway_before_output_amount,
                //
                pay_gateway_input_currency_type_id,
                pay_gateway_input_exchange_rate,
                pay_gateway_input_amount,
                //
                pay_gateway_output_currency_type_id,
                pay_gateway_output_exchange_rate,
                pay_gateway_output_amount,
                //
                description,
                shop_transaction_id,
            ],
        };
    }

    public static create__shopTransaction(input: ITable_ShopTransaction_Input): {
        sqlRequest: string,
        values: [
            number | null/*user_id*/,
            number/*status_id*/,
            number/*progress_id*/,
            number | null/*error_code_id*/,
            number | null/*error_reason_id*/,
        ],
    } {
        const {
            user_id = null,
            status_id,
            progress_id,
            error_code_id = null,
            error_reason_code_id = null,
        } = input;

        return {
            sqlRequest: `INSERT INTO ${TableNames.ShopTransaction} (
                ${Table_ShopTransaction_Columns.UserId},
                ${Table_ShopTransaction_Columns.StatusId},
                ${Table_ShopTransaction_Columns.ProgressId},
                ${Table_ShopTransaction_Columns.ErrorCodeId},
                ${Table_ShopTransaction_Columns.ErrorReasonCodeId}
            ) VALUES($1, $2, $3, $4, $5) RETURNING *`,
            values: [
                user_id,
                status_id,
                progress_id,
                error_code_id,
                error_reason_code_id,
            ],
        };
    }

    public static create__payGatewayInputPalych(input: ITable_PayGatewayInputPalych_Input): {
        sqlRequest: string,
        values: [
            number/*pay_gateway_input_id*/,
        ],
    } {
        const {
            pay_gateway_input_id,
        } = input;

        return {
            sqlRequest: `INSERT INTO ${TableNames.PayGatewayInputPalych} (
                ${Table_PayGatewayInputPalych_Columns.PayGatewayInputId}
            ) VALUES($1) RETURNING *`,
            values: [
                pay_gateway_input_id,
            ],
        };
    }

    public static create__payGatewayInputAntilopay(input: ITable_PayGatewayInputAntilopay_Input): {
        sqlRequest: string,
        values: [
            number/*pay_gateway_input_id*/,
        ],
    } {
        const {
            pay_gateway_input_id,
        } = input;

        return {
            sqlRequest: `INSERT INTO ${TableNames.PayGatewayInputAntilopay} (
                ${Table_PayGatewayInputAntilopay_Columns.PayGatewayInputId}
            ) VALUES($1) RETURNING *`,
            values: [
                pay_gateway_input_id,
            ],
        };
    }

    public static create__payGatewayOutputInterhub(input: ITable_PayGatewayOutputInterhub_Input): {
        sqlRequest: string,
        values: [
            number/*pay_gateway_output_id*/,
        ],
    } {
        const {
            pay_gateway_output_id,
        } = input;

        return {
            sqlRequest: `INSERT INTO ${TableNames.PayGatewayOutputInterhub} (
                ${Table_PayGatewayOutputInterhub_Columns.PayGatewayOutputId}
            ) VALUES($1) RETURNING *`,
            values: [
                pay_gateway_output_id,
            ],
        };
    }

    public static create__payGatewayInput(input: ITable_PayGatewayInput_Input): {
        sqlRequest: string,
        values: [
            number/*shop_transaction_id*/,
        ],
    } {
        const {
            shop_transaction_id,
        } = input;

        return {
            sqlRequest: `INSERT INTO ${TableNames.PayGatewayInput} (
                ${Table_PayGatewayInput_Columns.ShopTransactionId}
            ) VALUES($1) RETURNING *`,
            values: [
                shop_transaction_id,
            ],
        };
    }

    public static create__payGatewayOutput(input: ITable_PayGatewayOutput_Input): {
        sqlRequest: string,
        values: [
            number/*shop_transaction_id*/,
        ],
    } {
        const {
            shop_transaction_id,
        } = input;

        return {
            sqlRequest: `INSERT INTO ${TableNames.PayGatewayOutput} (
                ${Table_PayGatewayOutput_Columns.ShopTransactionId}
            ) VALUES($1) RETURNING *`,
            values: [
                shop_transaction_id,
            ],
        };
    }

    public static findOne(tableName: TableNames, options: {
        where: {
            name: string,
            value: unknown,
        }
    }): {
        sqlRequest: string,
        values: [
            unknown,
        ],
    } {
        const {
            where,
        } = options;

        return {
            sqlRequest: `SELECT * FROM ${tableName} WHERE ${where.name} = $1 LIMIT 1`,
            values: [ where.value ],
        };
    }

    public static update(tableName: TableNames, options: {
        updateInfo: {
            name: string,
            value: unknown,
        },
        where: {
            name: string,
            value: unknown,
        },
    }): {
        sqlRequest: string,
        values: [
            unknown,
            unknown,
        ],
    } {
        const {
            updateInfo,
            where,
        } = options;

        return {
            sqlRequest: `
            UPDATE ${tableName}
                SET ${updateInfo.name} = $1
                WHERE ${where.name} = $2;
                RETURNING *
            `,
            values: [ updateInfo.value, where.value ],
        };
    }
}

export async function pgQueryAndNormaliseResponse<R = object>(pool: Pool, sqlRequest: string, values: unknown[]): Promise<R | undefined> {
    return pool.query(sqlRequest, values).then(({ rows }) => rows[0]) as Promise<R | undefined>;
}
