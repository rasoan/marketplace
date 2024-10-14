/* eslint-disable no-magic-numbers */
'use strict';

/** Local идентификаторы сервисов */
export enum TopUpAccounts_ServiceLocalIdentifiers {
    Steam = 1,
}

/** Internal идентификаторы сервисов */
export enum AccountTopUpServiceInternalIdentifiers {
    Steam = 92,
}

export const enum ExchangeTypes_Palych {
    Rub = 'RUB',
}

export const enum AccountTypes_Palych {
    BANK_CARD = 'BANK_CARD',
}

export const enum ExchangeTypes_Interhub {
    Rub = 'RUB',
    Usd = 'USD',
}

export const enum PayGatewayInputType {
    Palych = 1,
    Antilopay = 2,
}

export const enum PayGatewayOutputType {
    Interhub = 1,
}

