//
import { CurrencyType } from '../../constants';

export namespace ITopUpAccount {
  export interface ICommissionRateLower {
    /** Сумма в $ начиная с которой понижение комиссии применится */
    startAmount: number;
    /**
     * Понижение комиссии (на сколько % уменьшиться комиссия),
     * которая применится (валюта пополнения именно целевая, не то что мы заработаем)
     * */
    value: number;
  }

  export type ICommissionRateLowersList = ICommissionRateLower[];

  export interface ICommissionRateLowersInfoForSpecialCurrencyType {
    currencyType: CurrencyType;
    /** Список диапазонов понижения комиссии для этой валюты пополнения */
    commissionRateLowersList: ICommissionRateLowersList;
  }

  export type ICommissionRateLowersInfoForCurrencyTypesList = ICommissionRateLowersInfoForSpecialCurrencyType[];

  export interface CommissionRateInfo {
    /** Наша комиссия */
    value: number;
    /** Информация с линейками скидок для разных коммиссий */
    commissionRateLowersInfoForCurrencyTypesList: ICommissionRateLowersInfoForCurrencyTypesList;
  }

  export interface AmountLimit {
    currencyType: CurrencyType;
    /** Минимальная сумма платежа (в долларах то что пойдёт в interhub) */
    min: number;
    /** Максимальная сумма платежа (в долларах то что пойдёт в interhub) */
    max: number;
  }

  export type AmountForCurrenciesLimitsList = AmountLimit[];

  /** Конифг данные которые храним в JSON файле */
  export interface TopUpAccountConfig {
    /** Лимиты */
    amountForCurrenciesLimitsList: AmountForCurrenciesLimitsList
    /** Наша комиссия (в рублях (хотя это же проценты, а значит какая разница), это заберём когда в palych пойдёт платёжка, т.е. до интерхаба) */
    commissionRateInfo: CommissionRateInfo;
  }

  export interface TopUpAccountConfigFrontendDTO extends TopUpAccountConfig {
  }
}
