'use strict';

import { TopUpAccountConfigWrapper } from "@deshopfrontend/src/utils/TopUpAccountConfigWrapper/TopUpAccountConfigWrapper";

import { ITopUpAccountBackend } from "./types/topUpAccountConfigBackend";

export class TopUpAccountConfigBackend extends TopUpAccountConfigWrapper {
    public topUpAccountConfig: Readonly<ITopUpAccountBackend.TopUpAccountConfigBackendDTO>;

    private constructor(topUpAccountsConfigDTO: ITopUpAccountBackend.TopUpAccountConfigBackendDTO) {
        super(topUpAccountsConfigDTO);
    }

    public toDTO(): ITopUpAccountBackend.TopUpAccountConfigBackendDTO {
        const {
            topUpAccountConfig,
        } = this;

        return {
            ...super.toDTO(),
            payGatewayInputType: topUpAccountConfig.payGatewayInputType,
            payGatewayOutputType: topUpAccountConfig.payGatewayOutputType,
        };
    }

    public static fromDTO(topUpAccountConfigServerDTO: ITopUpAccountBackend.TopUpAccountConfigBackendDTO): TopUpAccountConfigBackend {
        return new TopUpAccountConfigBackend(topUpAccountConfigServerDTO);
    }
}
