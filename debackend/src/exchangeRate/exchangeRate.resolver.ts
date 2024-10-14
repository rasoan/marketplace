'use strict';

import { Query, Resolver } from '@nestjs/graphql';
import { Inject } from '@nestjs/common';

import { ExchangeRateService } from "./exchangeRate.service";
import { ExchangeRateSteamOutput } from "./model/exchangeRate.model";

@Resolver()
export class ExchangeRateResolver {
    @Inject(ExchangeRateService)
    private readonly exchangeRatesService: ExchangeRateService;

    // eslint-disable-next-line class-methods-use-this
    @Query(() => ExchangeRateSteamOutput)
    public async getExchangeRates(): Promise<ExchangeRateSteamOutput> {
        return this.exchangeRatesService.getExchangeRates();
    }
}
