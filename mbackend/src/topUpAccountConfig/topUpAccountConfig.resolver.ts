'use strict';

import { Query, Resolver } from '@nestjs/graphql';
import { Inject } from '@nestjs/common';

import {
    TopUpAccountConfigDTOOutput,
} from "../topUpAccount/models/TopUpAccount.model";
import { TopUpAccountConfigService } from "./topUpAccountConfig.service";

@Resolver()
export class TopUpAccountConfigResolver {
    @Inject(TopUpAccountConfigService)
    private readonly topUpAccountConfigService: TopUpAccountConfigService;

    @Query(() => TopUpAccountConfigDTOOutput)
    public async getTopUpAccountConfig(): Promise<TopUpAccountConfigDTOOutput> {
        return this.topUpAccountConfigService.topUpAccountConfigBackend.topUpAccountConfig;
    }
}
