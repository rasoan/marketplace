//
import {
    AccountTopUpServiceInternalIdentifiers,
    AccountTypes_Palych,
    TopUpAccounts_ServiceLocalIdentifiers,
} from "@deshopfrontend/src/utils/topUpAccount/constants";
import { ITopUpAccount } from "@deshopfrontend/src/utils/topUpAccount/types/topUpAccount";

import { PalychPostbackNotification_Statuses } from "./constants";
import { CurrencyType } from "@deshopfrontend/src/utils/constants";
import {
    IAntilopayService,
    ICustomer,
} from "../../payGatewayWrapper/payGatewayInput/antilopay/types/antilopay.service";
import {
    Antilopay_RequestResultCodeType,
    Antilopay_PayStatusCode,
} from "../../payGatewayWrapper/payGatewayInput/antilopay/types/constants";

export interface ITopUpAccountInput {
    /** Сумма, которая пойдёт к клиенту */
    amount: number;
    /** Тип сервиса, который пополняет */
    serviceLocalId: TopUpAccounts_ServiceLocalIdentifiers;
    /** Логин сервиса который хочет пополнить */
    account: string;
    /** Доп текст от клиента */
    description?: string;
    // todo: exchangeType - по всему проекту переименовать в CurrencyType
    /** Валюта в которой пополняем клиента */
    currencyType: CurrencyType;
    /** Почтовый адрес клиента */
    email: string;
}

export interface ITopUpAccountOutput {
    /** Ссылка на страницу с оплатой */
    linkPagePay: string;
    /** Ссылка на страницу с QR-code */
    linkPagePayWithQRCode?: string;
    /** Идентификатор события, которое придёт клиенту (на frontend) после выполнения оплаты ордера */
    eventId: string;
}

export namespace ITopUpModelsOutput {
    export type TopUpAccountsConfig = ITopUpAccount.TopUpAccountConfig;
    export type TopUpAccountConfigFrontendDTO = ITopUpAccount.TopUpAccountConfigFrontendDTO;
    export type CommissionRateInfo = ITopUpAccount.CommissionRateInfo;
    export type CommissionRateLower = ITopUpAccount.ICommissionRateLower;
}

export interface IPalychPostbackNotificationEvent {
    /** Уникальный идентификатор клиента для фильтрации событий */
    eventId: string;
    /** Текст сообщения, которое мы отправим клиенту */
    message: string;
    /** Если определено и true, то событие негативное */
    isError?: boolean;
}

/* ---------- ---------- ---------- Tables ---------- ---------- ----------*/

/***/
export type ITable_Users_Input = null;

/***/
export interface ITable_Users_Output extends ITable_Users_Input {
    id: number,
    created_at: number,
}

/***/
export interface ITable_ShopTransaction_Input {
    user_id: number | null;
    /** Таблица users */
    status_id: number;
    progress_id: number;
    /** ключ таблицы error_code */
    error_code_id: number | null;
    error_reason_code_id: number | null;
}

/***/
export interface ITable_ShopTransaction_Output extends ITable_ShopTransaction_Input {
    id: number,
    created_at: number,
}

/***/
export interface ITable_ShopTransactionUserInfo_Input {
    email: string;
    /** id таблицы транзакции */
    shop_transaction_id: number;
}

/***/
export interface ITable_ShopTransactionUserInfo_Output extends ITable_ShopTransactionUserInfo_Input {
    id: number,
    created_at: number,
}

/***/
export interface ITable_ShopTransactionInfo_Input {
    /** Наш процент комиссии который применили к платежу */
    commission_rate: number;
    //
    /** Тип валюты клиента в которой клиент пополнял */
    pay_gateway_before_output_currency_type_id: number;
    /** Курс валюты в которой клиент пополнял */
    pay_gateway_before_output_exchange_rate: number;
    pay_gateway_before_output_amount: number;
    //
    /** Тип валюты в которой мы забрали деньги (в Palych например в Rub) */
    pay_gateway_input_currency_type_id: number;
    /** Курс доллара той валюты в которой мы забрали деньги (в Palych например Rub) */
    pay_gateway_input_exchange_rate: number;
    pay_gateway_input_amount: number;
    //
    /** Тип валюты в которой мы пополнили клиента (в Interhub например в $) */
    pay_gateway_output_currency_type_id: number;
    /** Курс доллара той валюты в которой мы пополнили клиента (в Interhub например $/$ = 1) */
    pay_gateway_output_exchange_rate: number;
    pay_gateway_output_amount: number;
    //
    /** Своими словами */
    description: string | null;
    /** id таблицы транзакции */
    shop_transaction_id: number;
}

export interface ITable_ShopTransactionInfo_Output extends ITable_ShopTransactionInfo_Input {
    id: number,
    created_at: number,
    updated_at: number,
}

/** Таблица входящих платёжек (palych, antilopay) */
export interface ITable_PayGatewayInput_Input {
    /** id транзакции */
    shop_transaction_id: number;
}

/** Таблица входящих платёжек (palych, antilopay)  */
export interface ITable_PayGatewayInput_Output extends ITable_PayGatewayInput_Input {
    id: number,
    created_at: number,
}

/** Тип валюты */
export interface ITable_CurrencyType_Input {
    currency_type_code: number;
    description: string;
}

/** Тип валюты */
export interface ITable_CurrencyType_Output extends ITable_CurrencyType_Input {
    id: number,
    created_at: number,
}

/** Таблица исходящих платёжек (interhub, etc..)  */
export interface ITable_PayGatewayOutput_Input {
    /** id транзакции */
    shop_transaction_id: number;
}

/** Таблица исходящих платёжек (interhub, etc..)  */
export interface ITable_PayGatewayOutput_Output extends ITable_PayGatewayOutput_Input {
    id: number,
    created_at: number,
}

/** Таблица Palych */
export interface ITable_PayGatewayInputPalych_Input {
    pay_gateway_input_id: number;
}

/** Таблица Palych */
export interface ITable_PayGatewayInputPalych_Output extends ITable_PayGatewayInputPalych_Input {
    id: number,
    created_at: number,
}

/** Таблица Antilopay */
export interface ITable_PayGatewayInputAntilopay_Input {
    pay_gateway_input_id: number;
}

/** Таблица Antilopay */
export interface ITable_PayGatewayInputAntilopay_Output extends ITable_PayGatewayInputAntilopay_Input {
    id: number,
    created_at: number,
}

/** Таблица Interhub */
export interface ITable_PayGatewayOutputInterhub_Input {
    pay_gateway_output_id: number;
}

/** Таблица Interhub */
export interface ITable_PayGatewayOutputInterhub_Output extends ITable_PayGatewayOutputInterhub_Input {
    id: number,
    created_at: number,
}

/***/
export interface ITable_PayGatewayInputPalychCreateBillRequest_Input {
    /**
     * Unique order ID. Will be sent within Postback.
     *
     * 12345
     */
    order_id: string | null,
    /**
     * Unique shop ID.
     *
     * LXZv3R7Q8B
     */
    shop_id: string,
    /**
     * Payment amount
     *
     * - "123.45"
     */
    amount: number,
    /**
     *  Description of payment
     */
    description: string | null,
    /**
     * Currency that customer sees during payment process.
     * If you skip this parameter in your request, the default currency of your Shop will be used during the payment process.
     * In case where shop_id doesn't exist, customer will pay in RUB.
     */
    currency_type: string | null,
    /**
     * Flag that sets who pays commission.
     */
    payer_pays_commission: 1 | 0 | null;
    /**
     * Type of payment link shows how many payments it could receive.
     * 'normal' type means that only one successful payment could be received for this link.
     * 'multi' type means that many payments could be received with one link.
     * - "multi"
     */
    type: "multi" | null;
    /**
     * You can send any string value in this field and it will be returned within postback.
     */
    custom: string | null;
    /**
     * Please specify the purpose of the payment. It will be shown on the payment form.
     */
    name: string | null;
    /**
     * You can send email in request, so customer will see it's already pre-filled on the payment page.
     */
    payer_email: string | null;
    /**
     * Идентификатор строки в таблице платёжки Palych
     */
    pay_gateway_input_palych_id: number;
}

/***/
export interface ITable_PayGatewayInputPalychCreateBillRequest_Output extends ITable_PayGatewayInputPalychCreateBillRequest_Input {
    id: number,
    created_at: number,
}

/***/
export interface ITable_PayGatewayInputPalychCreateBillResponse_Input {
    /** Ссылка на страницу оплаты с QR-code "https://palych.io/link/GkLWvKx3" */
    link_url: string,
    /** Ссылка на страницу оплаты "https://palych.io/transfer/GkLWvKx3" */
    link_page_url: string,
    /**
     * Payment status
     *
     * "true"
     */
    is_success: boolean;
    /**
     * 	Unique bill ID
     *
     * 	"GkLWvKx3"
     */
    bill_id: string;
    /**
     * Идентификатор строки в таблице платёжки Palych
     */
    pay_gateway_input_palych_id: number;
}

/***/
export interface ITable_PayGatewayInputPalychCreateBillResponse_Output extends ITable_PayGatewayInputPalychCreateBillResponse_Input {
    id: number,
    created_at: number,
}

// !!! если здесь null, То это или программный сбой или нас пытались хакнуть ложным postbacn notification о том что оплата прошла !!!
export interface ITable_PayGatewayInputPalychPostbackNotification_Input {
    /**
     * InvId - Unique order ID that you sent when you created a bill
     *
     * 123
     */
    order_id: string;
    /**
     * Payment amount
     *
     * 12345
     */
    out_sum: number;
    /**
     * Payment currency
     *
     * "RUB"
     */
    currency_in: string;
    /**
     * Transaction fees
     *
     * 123
     */
    commission: number;
    /**
     * Currency of payment
     *
     */
    currency: string;
    /**
     * TrsId Unique transaction ID
     *
     * LXZv3R7Q8B
     */
    trsId: string;
    /**
     * Payment status
     *
     * "SUCCESS"
     */
    status: string;
    /**
     * If you sent something in 'custom' filed when you created a bill, you will get this information back in the postback
     *
     * "custom_information"
     */
    custom: string | null;
    /**
     * Information about payment method
     *
     * "BANK_CARD"
     */
    account_type: string;
    /**
     * Amount that top up you balance after success payment
     *
     * "123"
     */
    balance_amount: number;
    /**
     * Balance currency
     *
     * "RUB"
     */
    balance_currency: string;
    /**
     * Payment account that customer used
     *
     * 220220******7046
     */
    account_number: string;
    /**
     * Error code
     *
     */
    error_code: number | null;
    /**
     * Error decsription
     *
     */
    error_message: string | null;
    /**
     * Signature. You can verify the postback that you received
     *
     * "398320589F8E31ACE27CC681BCBD8BDA"
     */
    signature_value: string;
    /**
     * Идентификатор строки в таблице платёжки Palych
     */
    pay_gateway_input_palych_id: number;
}

/***/
export interface ITable_PayGatewayInputPalychPostbackNotification_Output extends ITable_PayGatewayInputPalychPostbackNotification_Input {
    id: number,
    created_at: number,
}

/* todo: в доке Palych фигурирует ещё и такой JSON, но что с ним делать не понятно пока
 {
  "service_id":488,
  "account": "550831976",
  "agent_transaction_id":"637553186520953102",
  "amount":1000,
  "params": {
    "nominal" : 4100,
    "sender_name" : "Falonchi"
  }
}
 */

/***/
export interface ITable_PayGatewayOutputInterhubCheckRequestData_Input {
    /**
     * Идентификационный номер транзакции на стороне Агента.
     * Этот id не повторяется, и каждая новая операция должна сопровождаться новым id.
     *
     * С ним будет выполняться Pay
     */
    /**
     * Идентификационный номер транзакции на стороне Агента.Этот id не повторяется, и каждая новая операция должна сопровождаться новым id.
     */
    agent_transaction_id: string;
    /**
     * Сумма, отправленная агентом
     */
    amount: number;
    /**
     * Аккаунт или номер телефона
     */
    account: string;
    /**
     * Идентификационный номер Сервиса (Передается со стороны InterHub)
     */
    service_id: number;
    /**
     * Идентификатор строки в таблице платёжки Interhub
     */
    pay_gateway_output_interhub_id: number;
}

/***/
export interface ITable_PayGatewayOutputInterhubCheckRequest_Output extends ITable_PayGatewayOutputInterhubCheckRequestData_Input {
    id: number,
    created_at: number,
}

/***/
export interface ITable_PayGatewayOutputInterhubCheckResponse_Input {
    /**
     * Идентификационный номер транзакции на стороне Агента.
     * Этот id не повторяется, и каждая новая операция должна сопровождаться новым id.
     *
     * С ним будет выполняться Pay
     */
    /** Идентификатор транзакции */
    transaction_id: number;
    /**
     * Сумма, отправленная агентом
     */
    amount: number;
    /**
     *  Комиссия
     */
    commission: number;
    /**
     * Аккаунт или номер телефона
     */
    account: string;
    /** Тип валюты */
    currency: string;
    /**
     * Ответ от Биллинга
     */
    message: string | "Success";
    /**
     * Сумма в валюте, которую клиент получает
     */
    amount_in_currency: number;
    /** Возможно оплата или нет */
    success: boolean | null;
    /** Код ошибки или успешно */
    status: string;
    /**
     * Идентификатор строки в таблице платёжки Interhub
     */
    pay_gateway_output_interhub_id: number;
}

/***/
export interface ITable_PayGatewayOutputInterhubCheckResponse_Output extends ITable_PayGatewayOutputInterhubCheckResponse_Input {
    id: number,
    created_at: number,
}

export interface ITable_PayGatewayOutputInterhubPayRequest_Input {
    agent_transaction_id: string;
    /**
     * Идентификатор строки в таблице платёжки Interhub
     */
    pay_gateway_output_interhub_id: number;
}

/***/
export interface ITable_PayGatewayOutputInterhubPayRequest_Output extends ITable_PayGatewayOutputInterhubPayRequest_Input {
    id: number,
    created_at: number,
}

export interface ITable_PayGatewayOutputInterhubPayResponse_Input {
    /**
     * Идентификационный номер транзакции на стороне Агента.
     * Этот id не повторяется, и каждая новая операция должна сопровождаться новым id.
     *
     * (то что я получил в check и отправил в request pay)
     */
    agent_transaction_id: string,
    /** Ответ от сервера */
    message: string;
    /** Логический признак ошибки обработки запроса */
    success: boolean;
    /** Код ошибки если не успешно */
    error_code: number | null;
    /** Дополнительные параметры или информация о транзакции JSON */
    data: string | null;
    /**
     * Идентификатор строки в таблице платёжки Interhub
     */
    pay_gateway_output_interhub_id: number;
}

/***/
export interface ITable_PayGatewayOutputInterhubPayResponse_Output extends ITable_PayGatewayOutputInterhubPayResponse_Input {
    id: number,
    created_at: number,
}

/* ---------- ---------- ---------- Tables ---------- ---------- ----------*/
