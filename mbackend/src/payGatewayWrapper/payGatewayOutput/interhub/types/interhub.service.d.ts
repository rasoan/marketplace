//
import { TopUpAccounts_ServiceLocalIdentifiers } from "@deshopfrontend/src/utils/topUpAccount/constants";

export namespace IInterhubService {
    export interface SaveCheckMethodOptions {
        payGatewayOutputInterhubId: number;
        account: string;
        serviceLocalId: TopUpAccounts_ServiceLocalIdentifiers;
        amount: number;
    }

    export interface PayMethodOptions {
        payGatewayOutputInterhubId: number;
    }
}
