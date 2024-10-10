'use strict';

import { assertIsDefined } from '@detools/type_guards/base';

import { ITopUpAccount } from '../topUpAccount/types/topUpAccount';
import { CurrencyType } from '../constants';

export class TopUpAccountConfigWrapper {
    private _amountForCurrenciesLimitsList: ITopUpAccount.AmountForCurrenciesLimitsList;
    private _commissionRateInfo: ITopUpAccount.CommissionRateInfo;
    /***/
    public topUpAccountConfig: Readonly<ITopUpAccount.TopUpAccountConfig>;

    public commissionRate: number;

    protected constructor(topUpAccountsConfig: ITopUpAccount.TopUpAccountConfig) {
        const {
            amountForCurrenciesLimitsList,
            commissionRateInfo,
        } = topUpAccountsConfig;

        this._amountForCurrenciesLimitsList = amountForCurrenciesLimitsList;
        this._commissionRateInfo = commissionRateInfo;
        //
        this.commissionRate = commissionRateInfo.value;
        this.topUpAccountConfig = Object.freeze(topUpAccountsConfig);

        assertTopUpAccountsConfig(this);
    }

    public getAmountForCurrenciesLimitByCurrencyTypeForce(currencyType: CurrencyType): ITopUpAccount.AmountLimit {
        const amountForCurrenciesLimits = this._amountForCurrenciesLimitsList.find(
            amountForCurrenciesLimit => amountForCurrenciesLimit.currencyType === currencyType
        );

        assertIsDefined(amountForCurrenciesLimits, "amountForCurrenciesLimits should be defined");

        return amountForCurrenciesLimits;
    }

    public getCommissionRateLowersByCurrencyTypeForce(currencyType: CurrencyType): ITopUpAccount.ICommissionRateLowersInfoForSpecialCurrencyType {
        const commissionRateLowersListForCurrencyType = this._commissionRateInfo.commissionRateLowersInfoForCurrencyTypesList.find(
            commissionRateLowersListForCurrencyType => commissionRateLowersListForCurrencyType.currencyType === currencyType
        );

        assertIsDefined(commissionRateLowersListForCurrencyType, "commissionRateLowersListForCurrencyType should be defined");

        return commissionRateLowersListForCurrencyType;
    }

    public toDTO(): ITopUpAccount.TopUpAccountConfig {
        const {
            _commissionRateInfo: commissionRateInfo,
            _amountForCurrenciesLimitsList: amountForCurrenciesLimitsList,
        } = this;

        return {
            amountForCurrenciesLimitsList,
            commissionRateInfo,
        };
    }

    public static fromDTO(topUpAccountsConfig: ITopUpAccount.TopUpAccountConfig): TopUpAccountConfigWrapper {
        return new TopUpAccountConfigWrapper(topUpAccountsConfig);
    }
}

export function assertTopUpAccountsConfig(topUpAccountsConfig: TopUpAccountConfigWrapper) {
    const commissionRateLowersList_usd = topUpAccountsConfig.getCommissionRateLowersByCurrencyTypeForce(CurrencyType.Usd).commissionRateLowersList;
    const commissionRateLowersList_rub = topUpAccountsConfig.getCommissionRateLowersByCurrencyTypeForce(CurrencyType.Rub).commissionRateLowersList;
    const commissionRateLowersList_uah = topUpAccountsConfig.getCommissionRateLowersByCurrencyTypeForce(CurrencyType.Uah).commissionRateLowersList;
    const commissionRateLowersList_kzt = topUpAccountsConfig.getCommissionRateLowersByCurrencyTypeForce(CurrencyType.Kzt).commissionRateLowersList;

    const amountLimitInfo_usd = topUpAccountsConfig.getAmountForCurrenciesLimitByCurrencyTypeForce(CurrencyType.Usd);
    const amountLimitInfo_rub = topUpAccountsConfig.getAmountForCurrenciesLimitByCurrencyTypeForce(CurrencyType.Rub);
    const amountLimitInfo_uah = topUpAccountsConfig.getAmountForCurrenciesLimitByCurrencyTypeForce(CurrencyType.Uah);
    const amountLimitInfo_kzt = topUpAccountsConfig.getAmountForCurrenciesLimitByCurrencyTypeForce(CurrencyType.Kzt);

    // проверяем минимум
    {
        const [ commissionRateLowersListFirst_usd ] = commissionRateLowersList_usd;
        const [ commissionRateLowersListFirst_rub ] = commissionRateLowersList_rub;
        const [ commissionRateLowersListFirst_uah ] = commissionRateLowersList_uah;
        const [ commissionRateLowersListFirst_kzt ] = commissionRateLowersList_kzt;

        assertIsDefined(commissionRateLowersListFirst_usd, 'commissionRateLowersListFirst_usd is not defined!');
        assertIsDefined(commissionRateLowersListFirst_rub, 'commissionRateLowersListFirst_rub is not defined!');
        assertIsDefined(commissionRateLowersListFirst_uah, 'commissionRateLowersListFirst_uah is not defined!');
        assertIsDefined(commissionRateLowersListFirst_kzt, 'commissionRateLowersListFirst_kzt is not defined!');

        if (commissionRateLowersListFirst_usd.startAmount < amountLimitInfo_usd.min
              || commissionRateLowersListFirst_rub.startAmount < amountLimitInfo_rub.min
              || commissionRateLowersListFirst_uah.startAmount < amountLimitInfo_uah.min
              || commissionRateLowersListFirst_kzt.startAmount < amountLimitInfo_kzt.min
        ) {
            throw new Error("commissionRateLowersListFirst.value can't be lower than min amount!");
        }
    }

    // проверяем максимум
    {
        // eslint-disable-next-line no-magic-numbers
        const commissionRateLowersListLast_usd = commissionRateLowersList_usd.at(-1);
        // eslint-disable-next-line no-magic-numbers
        const commissionRateLowersListLast_rub = commissionRateLowersList_rub.at(-1);
        // eslint-disable-next-line no-magic-numbers
        const commissionRateLowersListLast_uah = commissionRateLowersList_uah.at(-1);
        // eslint-disable-next-line no-magic-numbers
        const commissionRateLowersListLast_kzt = commissionRateLowersList_kzt.at(-1);

        assertIsDefined(commissionRateLowersListLast_usd, 'commissionRateLowersListLast_usd is not defined!');
        assertIsDefined(commissionRateLowersListLast_rub, 'commissionRateLowersListLast_rub is not defined!');
        assertIsDefined(commissionRateLowersListLast_uah, 'commissionRateLowersListLast_uah is not defined!');
        assertIsDefined(commissionRateLowersListLast_kzt, 'commissionRateLowersListLast_kzt is not defined!');

        if (commissionRateLowersListLast_usd.startAmount > amountLimitInfo_usd.max) {
            console.error("commissionRateLowersListLast_usd", JSON.stringify(commissionRateLowersListLast_usd));
            console.error("amountLimitInfo_usd.max", JSON.stringify(amountLimitInfo_usd));

            throw new Error("commissionRateLowersListLast.value can't be greater than max amount!");
        } else if (commissionRateLowersListLast_rub.startAmount > amountLimitInfo_rub.max) {
            console.error("commissionRateLowersListLast_rub", JSON.stringify(commissionRateLowersListLast_rub));
            console.error("amountLimitInfo_rub.max", JSON.stringify(amountLimitInfo_rub));

            throw new Error("commissionRateLowersListLast.value can't be greater than max amount!");
        } else if (commissionRateLowersListLast_uah.startAmount > amountLimitInfo_uah.max) {
            console.error("commissionRateLowersListLast_uah", JSON.stringify(commissionRateLowersListLast_uah));
            console.error("amountLimitInfo_uah.max", JSON.stringify(amountLimitInfo_uah));

            throw new Error("commissionRateLowersListLast.value can't be greater than max amount!");
        } else if (commissionRateLowersListLast_kzt.startAmount > amountLimitInfo_kzt.max) {
            console.error("commissionRateLowersListLast_kzt", JSON.stringify(commissionRateLowersListLast_kzt));
            console.error("amountLimitInfo_kzt.max", JSON.stringify(amountLimitInfo_kzt));

            throw new Error("commissionRateLowersListLast.value can't be greater than max amount!");
        }
    }

    // todo: по хорошему надо бы ещё проверить, что снижение комиссии не ниже самой комиссии
}
