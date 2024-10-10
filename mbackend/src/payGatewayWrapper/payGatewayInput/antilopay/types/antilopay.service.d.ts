//
import { Antilopay_RequestResultCodeType, Antilopay_PayStatusCode } from "./constants";

export namespace IAntilopayService {
    export interface ICreateBillMethodOptions {
        /** Сумма, которая пойдёт к клиенту */
        amount: number;
        /** Идентификатор таблицы Antilopay */
        payGatewayInputAntilopayId: number;
        customer: {
            email: string;
        },
    }

    export interface IPostbackNotificationMethodResult {
        transactionId: number;
        billId: string;
        amount: number;
    }

    // post: https://lk.antilopay.com/api/v1/payment/create
    export interface CreateBillRequestData {
         /* Идентификатор проекта мерчанта */
        project_identificator: string;
         /* Сумма платежа */
        amount: number;
         /* Идентификатор платежа на стороне мерчанта. Должен быть уникальным */
        order_id: string;
         /* Валюта. Только "RUB" */
        currency: "RUB";
         /* Название товара/услуги */
        product_name: string;
         /* Принимает значения: "goods" (товары), "services" (услуги) */
        product_type: "services" | "goods";
         /* Количество товара/услуги, значение по умолчанию - 1 */
        product_quantity?: number;
         /* Ставка ндс, возможные значения: 10, 20. Поле */
        vat?: number;
         /* Описание платежа */
        description: string;
         /* URL переадресации покупателя после успешной оплаты */
        success_url?: string;
         /* URL переадресации покупателя после неуспешной оплаты */
        fail_url?: string;
         /* Данные покупателя */
        customer: Customer;
    }

    export interface Customer {
        /* Электронная почта покупателя. Если указан phone, то можно пропустить */
        email: string;
        /* Номер телефона покупателя. Если указан email, то можно пропустить */
        phone?: string;
        /* Адрес покупателя */
        address?: string;
        /* IP адрес покупателя */
        ip?: string;
        /* ФИО покупателя */
        fullname?: string;
    }

    export interface ICreateBillResponseData {
        /* число Код ответа на запрос: 0 – запрос успешный; иначе – запрос завершился с ошибкой */
        code: Antilopay_RequestResultCodeType;
        /* Идентификатор платежа в системе Antilopay */
        payment_id: string;
        /* Ссылка на форму оплаты платежа */
        payment_url: string;
        /* Описание ошибки. Отображается, если code не равен 0 */
        error?: string;
    }

    export interface PostbackNotificationOptions {
        /* Значение всегда равно payment для платежей */
        type: string;
        /* Идентификатор платежа в системе Antilopay */
        payment_id: string;
        /* Идентификатор платежа со стороны мерчанта */
        order_id: string;
        /* Время создания платежа */
        ctime: string;
        /* Сумма платежа, которая зачислиться на баланс */
        amount: number;
        /* Сумма платежа, указанная при создании */
        original_amount: number;
        /* Сумма комиссии */
        fee: number;
        /* Статус платежа */
        status: Antilopay_PayStatusCode;
        /* Валюта платежа */
        currency: string;
        /* Наименование продукта/услуги */
        product_name: string;
        /* Описание платежа */
        description: string;
        /* Способ оплаты. Отображается, если оплата прошла успешно или завершилась с ошибкой */
        pay_method: string;
        /* Данные оплаты. Отображается, если оплата прошла успешно или завершилась с ошибкой */
        pay_data: string;
        /* IP адрес покупателя. Отображается, если оплата прошла успешно или завершилась с ошибкой */
        customer_ip: string;
        /* UserAgent покупателя. Отображается, если оплата прошла успешно или завершилась с ошибкой */
        customer_useragent: string;
        /* объект Данные покупателя, указанные при создании платежа */
        customer: Customer;
    }
}
/*
пример postback notif
{
    "type": "payment",
    "payment_id": "APAYE98274D61702540483325",
    "order_id": "MERCHANT_ORDER_ID_0001",
    "ctime": "2023-11-29 14:30:00.012345",
    "amount": 1000.00,
    "original_amount": 1000.00,
    "fee": 0.00,
    "status": "PENDING",
    "currency": "RUB",
    "product_name": "your product name",
    "description": "your description",
    "pay_method": "CARD_RU",
    "pay_data": "411111******1111",
    "customer": {
    "email": "test@mail.com",
        "phone": "+79507008005",
        "ip": "96.10.250.1",
        "address": "Moscow, st. Pushkina, 1",
        "fullname": "John Doe"
}
*/

/*
bill create
Пример ответа на успешный запрос:
{
    "code": 0,
    "payment_id": "APAY4AA6BB4B1701155257296",
    "payment_url": "https://gate.antilopay.com/#payment/APAY4AA6BB4B1701155257296"
}
Пример ответа с ошибкой:
{
    "code": 3,
}
*/

export interface ITable_PayGatewayInputAntilopayCreateBill_Request_Input {
    /* Идентификатор проекта мерчанта */
    project_identificator: string;
    /* Сумма платежа */
    amount: number;
    /* Идентификатор платежа на стороне мерчанта. Должен быть уникальным */
    order_id: string;
    /* Валюта. Только "RUB" */
    currency: "RUB";
    /* Название товара/услуги */
    product_name: string;
    /* Принимает значения: "goods" (товары), "services" (услуги) */
    product_type: "services" | "goods";
    /* Количество товара/услуги, значение по умолчанию - 1 */
    product_quantity: number | null;
    /* Ставка ндс, возможные значения: 10, 20. Поле */
    vat: number | null;
    /* Описание платежа */
    description: string;
    /* URL переадресации покупателя после успешной оплаты */
    success_url: string | null;
    /* URL переадресации покупателя после неуспешной оплаты */
    fail_url: string | null;
    /* Данные покупателя JSON */
    customer: string;
    /**
     * Идентификатор строки в таблице платёжки Antilopay
     */
    pay_gateway_input_antilopay_id: number;
}

export interface ITable_PayGatewayInputAntilopayCreateBillRequest_Output extends ITable_PayGatewayInputAntilopayCreateBill_Request_Input {
    id: number,
    created_at: number,
}

export interface ITable_PayGatewayInputAntilopayCreateBill_Response_Input {
    /* число Код ответа на запрос: 0 – запрос успешный; иначе – запрос завершился с ошибкой */
    code: Antilopay_RequestResultCodeType;
    /* Идентификатор платежа в системе Antilopay */
    payment_id: string;
    /* Ссылка на форму оплаты платежа */
    payment_url: string;
    /* Описание ошибки. Отображается, если code не равен 0 */
    error: string | null;
    /**
     * Идентификатор строки в таблице платёжки Antilopay
     */
    pay_gateway_input_antilopay_id: number;
}

export interface ITable_PayGatewayInputAntilopayCreateBillResponse_Output extends ITable_PayGatewayInputAntilopayCreateBill_Response_Input {
    id: number,
    created_at: number,
}

export interface ITable_PayGatewayInputAntilopayPostbackNotification_Input {
    /* Значение всегда равно payment для платежей */
    type: string;
    /* Идентификатор платежа в системе Antilopay */
    payment_id: string;
    /* Идентификатор платежа со стороны мерчанта */
    order_id: string;
    /* Время создания платежа */
    ctime: string;
    /* Сумма платежа, которая зачислиться на баланс */
    amount: number;
    /* Сумма платежа, указанная при создании */
    original_amount: number;
    /* Сумма комиссии */
    fee: number;
    /* Статус платежа */
    status: Antilopay_PayStatusCode;
    /* Валюта платежа */
    currency: string;
    /* Наименование продукта/услуги */
    product_name: string;
    /* Описание платежа */
    description: string;
    /* Способ оплаты. Отображается, если оплата прошла успешно или завершилась с ошибкой */
    pay_method: string;
    /* Данные оплаты. Отображается, если оплата прошла успешно или завершилась с ошибкой */
    pay_data: string;
    /* IP адрес покупателя. Отображается, если оплата прошла успешно или завершилась с ошибкой */
    customer_ip: string;
    /* UserAgent покупателя. Отображается, если оплата прошла успешно или завершилась с ошибкой */
    customer_useragent: string;
    /* объект Данные покупателя, указанные при создании платежа JSON */
    customer: string;
    /**
     * Идентификатор строки в таблице платёжки Antilopay
     */
    pay_gateway_input_antilopay_id: number;
}

export interface ITable_PayGatewayInputAntilopayPostbackNotification_Output extends ITable_PayGatewayInputAntilopayPostbackNotification_Input {
    id: number,
    created_at: number,
}
