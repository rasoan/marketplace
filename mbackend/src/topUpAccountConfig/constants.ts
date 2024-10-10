'use strict';

import { ITopUpAccount } from "@deshopfrontend/src/utils/topUpAccount/types/topUpAccount";
import { PayGatewayInputType, PayGatewayOutputType } from "@deshopfrontend/src/utils/topUpAccount/constants";
import { CurrencyType } from "@deshopfrontend/src/utils/constants";

import { ITopUpAccountBackend } from "./TopUpAccountConfigServer/types/topUpAccountConfigBackend";

// todo: планировал это положить в accountTopUps.config.json, но не получилось, nest пытается импортнуть это из dist
const topUpAccountsConfigDTO: ITopUpAccount.TopUpAccountConfig = {
    amountForCurrenciesLimitsList: [
        {
            currencyType: CurrencyType.Usd,
            min: 0.8,
            max: 108,
        },
        {
            currencyType: CurrencyType.Rub,
            min: 100,
            max: 10_000,
        },
        {
            currencyType: CurrencyType.Uah,
            min: 50,
            max: 4400,
        },
        {
            currencyType: CurrencyType.Kzt,
            min: 500,
            max: 50_000,
        },
    ],
    commissionRateInfo: {
        value: 16,
        commissionRateLowersInfoForCurrencyTypesList: [
            {
                currencyType: CurrencyType.Usd,
                commissionRateLowersList: [
                    { startAmount: 10.8, value: 2 },
                    { startAmount: 21.6, value: 4 },
                    { startAmount: 64.6, value: 7 },
                ],
            },
            {
                currencyType: CurrencyType.Rub,
                commissionRateLowersList: [
                    { startAmount: 1_000, value: 2 },
                    { startAmount: 2_000, value: 4 },
                    { startAmount: 6_000, value: 7 },
                ],
            },
            {
                currencyType: CurrencyType.Uah,
                commissionRateLowersList: [
                    { startAmount: 500, value: 2 },
                    { startAmount: 1000, value: 4 },
                    { startAmount: 2700, value: 7 },
                ],
            },
            {
                currencyType: CurrencyType.Kzt,
                commissionRateLowersList: [
                    { startAmount: 5_000, value: 2 },
                    { startAmount: 10_000, value: 4 },
                    { startAmount: 30_000, value: 7 },
                ],
            },
        ],
    },
};

export const topUpAccountConfigBackendDTO: ITopUpAccountBackend.TopUpAccountConfigBackendDTO = {
    ...topUpAccountsConfigDTO,
    payGatewayInputType: PayGatewayInputType.Palych,
    payGatewayOutputType: PayGatewayOutputType.Interhub,
};
