// todo: вынести этот тип в backend
import { PayGatewayInputType, PayGatewayOutputType } from "@deshopfrontend/src/utils/topUpAccount/constants";
import { ITopUpAccount } from "@deshopfrontend/src/utils/topUpAccount/types/topUpAccount";

export namespace ITopUpAccountBackend {
    export interface TopUpAccountConfigBackendDTO extends ITopUpAccount.TopUpAccountConfig {
        payGatewayInputType: PayGatewayInputType;
        payGatewayOutputType: PayGatewayOutputType;
    }
}
