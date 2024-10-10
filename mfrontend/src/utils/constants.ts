/* eslint-disable no-magic-numbers */
export enum CurrencyType {
    Rub = 1,
    Usd = 2,
    Uah = 3,
    Kzt = 4,
}

export enum Status {
    InProgress = 1,
    Error = 2,
    Success = 3,
}

export enum TransactionProgress {
    CreatingBill = 1,
    PayingBill = 2,
    PayingClient = 3,
    Success = 4,
}

export enum TransactionErrorReasonCode {
    PayGatewayInput = 1,
    PayGatewayOutput = 2,
    ApiExchangeRate = 3,
    Backend = 4,
    Database = 5,
    Client = 6,
    Unknown = 7,
}

export enum ErrorCode {
    RequestTimeout = 1,
    ClientTimeout = 2,
    Unknown = 3,
}

export const CurrencyIcon: { [key in CurrencyType]: string } = {
    [CurrencyType.Rub]: '₽',
    [CurrencyType.Usd]: '$',
    [CurrencyType.Uah]: '₴',
    [CurrencyType.Kzt]: '₸',
};

export const CurrencyData = [
    { type: CurrencyType.Rub, icon: CurrencyIcon[CurrencyType.Rub], code: 'RUB', flag: '/images/flag-ru.svg', alt: 'Russian Flag' },
    { type: CurrencyType.Usd, icon: CurrencyIcon[CurrencyType.Usd], code: 'USD', flag: '/images/flag-us.svg', alt: 'USA Flag' },
    { type: CurrencyType.Uah, icon: CurrencyIcon[CurrencyType.Uah], code: 'UAH', flag: '/images/flag-ua.svg', alt: 'Ukraine Flag' },
    { type: CurrencyType.Kzt, icon: CurrencyIcon[CurrencyType.Kzt], code: 'KZT', flag: '/images/flag-kz.svg', alt: 'Kazakhstan Flag' },
];
