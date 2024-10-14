//
import {
    PayGatewayInputType,
    TopUpAccounts_ServiceLocalIdentifiers,
} from "@deshopfrontend/src/utils/topUpAccount/constants";

export namespace IEventEmitterWrapper {
    export interface PayGatewayInputSuccessEventOptions {
        eventData: PayGatewayInputSuccessEventData;
    }

    export interface PayGatewayInputSuccessEventData {
        transactionId: number;
        payGatewayInputType: PayGatewayInputType;
        billId: string;
        amount: number;
    }

    export type OnPayGatewayInputSuccessCallback = EventListener<IEventEmitterWrapper.PayGatewayInputSuccessEventData>;
}
