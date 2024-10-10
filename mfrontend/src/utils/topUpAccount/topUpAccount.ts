'use strict';

import { assertIsDefined, assertIsNumberType } from '@detools/type_guards/base';

import { CurrencyType } from '../constants';
import {
    AccountTopUpServiceInternalIdentifiers,
    ExchangeTypes_Interhub,
    ExchangeTypes_Palych,
    TopUpAccounts_ServiceLocalIdentifiers,
} from './constants';
import { ExchangeRateWrapper } from '../ExchangeRateWrapper/ExchangeRateWrapper';
import { IExchangeRate } from '../ExchangeRate/types/exchangeRate';
import { TopUpAccountConfigWrapper } from '../TopUpAccountConfigWrapper/TopUpAccountConfigWrapper';

/**
 * Из localId в internalId
 *
 * @param localId
 */
export function accountTopUpLocalIdToInternalId(localId: TopUpAccounts_ServiceLocalIdentifiers): AccountTopUpServiceInternalIdentifiers {
    switch (localId) {
        case TopUpAccounts_ServiceLocalIdentifiers.Steam: {
            return AccountTopUpServiceInternalIdentifiers.Steam;
        }
        default: {
            throw new Error("Unknown account TopUpServiceInternalIdentifiers");
        }
    }
}

/**
 * Из internalId в localId
 *
 * @param localId
 */
export function accountTopUpInternalIdToLocalId(localId: AccountTopUpServiceInternalIdentifiers): TopUpAccounts_ServiceLocalIdentifiers {
    switch (localId) {
        case AccountTopUpServiceInternalIdentifiers.Steam: {
            return TopUpAccounts_ServiceLocalIdentifiers.Steam;
        }
        default: {
            throw new Error("Unknown account TopUpServiceInternalIdentifiers");
        }
    }
}

/**
 * Из localId в internalId
 *
 * @param exchengeTypePalych
 */
export function exchangeTypePalychToExchengeType(exchengeTypePalych: ExchangeTypes_Palych): CurrencyType {
    switch (exchengeTypePalych) {
        case ExchangeTypes_Palych.Rub: {
            return CurrencyType.Rub;
        }
        default: {
            throw new Error("Unexpected exchengeTypePalych for exchangeType");
        }
    }
}

/**
 * Из internalId в localId
 *
 * @param exchengeType
 */
export function exchangeTypeToExchengeTypePalych(exchengeType: CurrencyType): ExchangeTypes_Palych {
    switch (exchengeType) {
        case CurrencyType.Rub: {
            return ExchangeTypes_Palych.Rub;
        }
        default: {
            throw new Error("Unexpected ExchangeTypes for ExchangeTypes_Palych");
        }
    }
}

/**
 * Из localId в internalId
 *
 * @param exchengeTypePalych
 */
export function exchangeTypeInterhubToExchengeType(exchengeTypePalych: ExchangeTypes_Interhub): CurrencyType {
    switch (exchengeTypePalych) {
        case ExchangeTypes_Interhub.Rub: {
            return CurrencyType.Rub;
        }
        case ExchangeTypes_Interhub.Usd: {
            return CurrencyType.Usd;
        }
        default: {
            throw new Error("Unexpected exchengeTypePalych for ExchangeTypes");
        }
    }
}

/**
 * Из internalId в localId
 *
 * @param exchengeType
 */
export function exchangeTypeToExchengeTypeInterhub(exchengeType: CurrencyType): ExchangeTypes_Interhub {
    switch (exchengeType) {
        case CurrencyType.Rub: {
            return ExchangeTypes_Interhub.Rub;
        }
        default: {
            throw new Error("Unexpected ExchangeTypes for ExchangeTypes_Interhub");
        }
    }
}

export function getLabelByServiceId(options: {
    serviceLocalId: TopUpAccounts_ServiceLocalIdentifiers,
    handleErrorCallback?: () => void,
}): string {
    const {
        serviceLocalId,
        handleErrorCallback = () => void 0,
    } = options || {};

    switch (serviceLocalId) {
        case TopUpAccounts_ServiceLocalIdentifiers.Steam: {
            return 'steam';
        }
        default: {
            handleErrorCallback();

            throw new Error(`Can't get label for service, because unknown serviceLocalId: ${serviceLocalId}`);
        }
    }
}

/**
 *
 * @param options
 * @param options.amount - в российских рублях
 * @param options.exchangeRate - курс доллара
 *
 * @returns - в долларах возвращаем (на текущий момент договор с interhub в долларах)
 */
export function getAmountAfterConvertExchangeRate(options: {
    amount: number,
    exchangeRate: IExchangeRate.ExchangeRate,
}): number {
    const {
        amount,
        exchangeRate,
    } = options;

    return normalizeNumberFloat(exchangeRate.value * amount);
}

export function getLabelByExchangeType(options: {
    externalType?: CurrencyType | null,
    handleErrorCallback?: () => void,
}): string {
    const {
        externalType,
        handleErrorCallback = () => void 0,
    } = options || {};

    switch (externalType) {
        case CurrencyType.Rub: {
            return 'RUB';
        }
        case CurrencyType.Usd: {
            return 'USD';
        }
        default: {
            const errorText = `Can't get label for external, because unknown external type: ${externalType}`;

            handleErrorCallback();

            throw new Error(errorText);
        }
    }
}

/**
 * Вычисляем сумму, которая пойдёт клиенту после нашей комиссии
 *
 * Это первое, что мы делаем, сразу получаем сумму после нашей комиссии,
 *
 * @param options
 */
export function getAmountAfterOurCommission(options: {
    amountRaw: number,
    currencyType: CurrencyType,
    topUpAccountConfig: TopUpAccountConfigWrapper,
}): {
    /** то что осталось от суммы после нашей комиссии */
    amount_afterOurCommission: number,
    /** то что мы заработали */
    amountOur: number,
} {
    const {
        amountRaw,
    } = options;
    const commissionRate = getCommissionRateByAmount(options);

    // eslint-disable-next-line no-magic-numbers
    const amountOur = amountRaw * commissionRate / 100/*100%*/;

    // eslint-disable-next-line no-magic-numbers
    return {
        amountOur: normalizeNumberFloat(amountOur),
        amount_afterOurCommission: normalizeNumberFloat(amountRaw - amountOur),
    };
}

/**
 * Получить сумму с нашей комиссией, вот например клиент подаёт 10$,
 * наш процент 16,
 * а мы ему возвращаем 11.6$, поскольку здесь 1.6$ - наша комиссия
 *
 * @param options
 */
export function getAmountWithOurCommission(options: {
    amountRaw: number,
    currencyType: CurrencyType,
    topUpAccountConfig: TopUpAccountConfigWrapper,
}): {
    /** amount */
    value: number;
    /** commission */
    commissionRateValue: number;
} {
    const {
        amountRaw,
        currencyType,
        topUpAccountConfig,
    } = options;

    const commissionRate = getCommissionRateByAmount({
        amountRaw,
        topUpAccountConfig,
        currencyType,
    });

    return {
        // eslint-disable-next-line no-magic-numbers
        value: normalizeNumberFloat(amountRaw * (1 + (commissionRate / 100))),
        commissionRateValue: commissionRate,
    };
}

/**
 * Из валюты клиента получить сумму которую ему надо будет оплатить в нашей валюте - т.е. в рублях
 *
 * @param options
 */
export function getAmountWithOurCommissionInRub(options: {
    /** Сумма в клиентской валюте пополнения */
    amount: number;
    /** Тип валюты которой клиент пополняется */
    clientCurrencyType: CurrencyType;
    /** конфиг */
    topUpAccountConfig: TopUpAccountConfigWrapper;
    exchangeRateWrapper: ExchangeRateWrapper;
}) {
    const {
        amount,
        clientCurrencyType,
        topUpAccountConfig,
        exchangeRateWrapper,
    } = options;

    /** курс $ по отношению к валюте from */
    const exchangeRateUsdFrom: number = exchangeRateWrapper.getExchangeRateSteamByCurrencyTypeForce(clientCurrencyType).value;
    /** курс $ по отношению к валюте to (в данном случае это всегда RUB) */
    const exchangeRateUsdTo: number = exchangeRateWrapper.getExchangeRateSteamByCurrencyTypeForce(CurrencyType.Rub).value;

    const amountWithOurCommissionClientCurrency = getAmountWithOurCommission({
        amountRaw: amount,
        currencyType: clientCurrencyType,
        topUpAccountConfig,
    });

    return convertCurrencyAmount({
        amount: amountWithOurCommissionClientCurrency.value,
        exchangeRateUsdFrom,
        exchangeRateUsdTo,
    });
}

export function normalizeNumberFloat(value: number): number {
    /* Оставляем 2 разряда после запятой */
    // eslint-disable-next-line no-magic-numbers
    return Number.parseFloat(value.toFixed(2));
}

function getCommissionRateByAmount(options: {
    amountRaw: number,
    currencyType: CurrencyType,
    topUpAccountConfig: TopUpAccountConfigWrapper,
}): number {
    const {
        amountRaw,
        currencyType,
        topUpAccountConfig,
    } = options;

    const {
        commissionRateLowersList,
    } = topUpAccountConfig.getCommissionRateLowersByCurrencyTypeForce(currencyType);

    let commissionRate = topUpAccountConfig.commissionRate;

    for (const [ index, commissionRateLower_current ] of commissionRateLowersList.entries()) {
        // В цикле мы идём только вперёд, если мы как-то забежали туда, где сумма пополнения меньше текущего диапазона скидок,
        // то разбираться смысла нет, скидки точно не будет.
        if (amountRaw < commissionRateLower_current.startAmount) {
            break;
        }

        // Если дошли до последнего понижения комиссии, то дальше вариантов нет, это и есть нужное понижение комиссии
        if (index >= (commissionRateLowersList.length - 1)) {
            commissionRate -= commissionRateLower_current.value;

            break;
        }
        else {
            const commissionRateLower_next = commissionRateLowersList[index + 1];

            assertIsDefined(commissionRateLower_next, `commissionRateLower_next next should be! ${index}, ${JSON.stringify(commissionRateLowersList)}`);

            // Если не тянем до следующей скидки
            if (amountRaw < commissionRateLower_next.startAmount) {
                commissionRate -= commissionRateLower_current.value;

                break;
            }
        }
    }

    assertIsNumberType(commissionRate, { isPositiveCheck: true });

    return commissionRate;
}

export function convertCurrencyAmount(options: {
    /** Сумма в клиентской валюте */
    amount: number,
    /** курс $ по отношению к валюте from */
    exchangeRateUsdFrom: number,
    /** курс $ по отношению к валюте to */
    exchangeRateUsdTo: number,
}): number {
    const {
        amount,
        exchangeRateUsdTo,
        exchangeRateUsdFrom,
    } = options;
    const amount_usd = amount / exchangeRateUsdFrom;

    return normalizeNumberFloat(exchangeRateUsdTo * amount_usd);
}

/**
 * Проверщик лимитов пополнения
 *
 * @param options
 * @param options.amount -
 * @param options.currencyType -
 * @param options.topUpAccountConfig -
 * @param options.isThrowError - кидать ошибку в случае не соответствия
 */
export function checkLimitersAmountAndConditionalThrowError(options: {
    amount: number;
    currencyType: CurrencyType;
    topUpAccountConfig: TopUpAccountConfigWrapper;
    isThrowError?: boolean;
}) {
    const {
        amount,
        currencyType,
        topUpAccountConfig,
        isThrowError,
    } = options;

    const amountLimit = topUpAccountConfig.getAmountForCurrenciesLimitByCurrencyTypeForce(currencyType);

    if (amount < amountLimit.min) {
        if (isThrowError) {
            throw new Error(`Below the minimum replenishment level! amountLimit.min is ${amountLimit.min} but amount is ${amount}`);
        }
        else {
            return false;
        }
    }
    else if (amount > amountLimit.max) {
        if (isThrowError) {
            throw new Error(`Recharge limit exceeded! amountLimit.max is ${amountLimit.max} but amount is ${amount}`);
        }
        else {
            return false;
        }
    }

    return true;
}
