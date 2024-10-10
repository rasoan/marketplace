//
import { TopUpAccounts_ServiceLocalIdentifiers } from "@deshopfrontend/src/utils/topUpAccount/constants";

export namespace IPayGatewayWrapper {
    export interface SavePayMethodOptions {
        /** Идентификатор таблицы транзакций */
        transactionId: number;
        account: string;
        serviceLocalId: TopUpAccounts_ServiceLocalIdentifiers;
        amount: number;
    }

    export interface PayMethodOptions {
        /** Идентификатор таблицы транзакций */
        transactionId: number;
    }

    export interface CreateBillMethodOptions {
        /** Сумма, которая пойдёт к клиенту */
        amount: number;
        /** Идентификатор таблицы транзакций */
        transactionId: number;
        clientEmail: string;
    }
}
