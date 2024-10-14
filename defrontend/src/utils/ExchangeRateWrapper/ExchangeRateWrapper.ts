'use strict';

import { assertIsDefined } from '@detools/type_guards/base';

import { CurrencyType } from '../constants';
import { IExchangeRate } from '../ExchangeRate/types/exchangeRate';
import { IExchangeRateWrapper } from './types/ExchangeRateWrapper';

export class ExchangeRateWrapper {
    public exchangeRatesSteamList: IExchangeRate.ExchangeRatesList;

    constructor(options?:  IExchangeRateWrapper.IExchangeRateWrapperOptions) {
        this.exchangeRatesSteamList = options?.exchangeRatesSteamList || [];
    }

    public getExchangeRateSteamByCurrencyTypeForce(currencyType: CurrencyType): IExchangeRate.ExchangeRate {
        const exchangeRateSteam = this.exchangeRatesSteamList.find(
            exchangeRateSteam => exchangeRateSteam.type === currencyType
        );

        assertIsDefined(exchangeRateSteam, "exchangeRateSteam should be defined");

        return exchangeRateSteam;
    }
}
