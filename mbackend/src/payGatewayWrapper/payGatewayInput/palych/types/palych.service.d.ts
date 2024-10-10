//
import type { IBaseHttpPalych } from "../../../../baseHttp/types/baseHttpPalych";

export namespace IPalychService {
    export interface ICreateBillOptions {
        /** Сумма, которая пойдёт к клиенту */
        amount: number;
        /** Идентификатор таблицы Palych */
        payGatewayInputPalychId: number;
    }

    export interface ICreateBillResult {}

    export type IPostbackNotificationOptions = IBaseHttpPalych.PostbackPaymentNotificationData;

    export interface IPostbackNotificationResult {
        transactionId: number;
        billId: string;
        amount: number;
    }
}
