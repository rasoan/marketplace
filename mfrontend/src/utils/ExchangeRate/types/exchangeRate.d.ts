//
import type { CurrencyType } from '../../constants';

export namespace IExchangeRate {
   export interface ExchangeRate {
     type: CurrencyType;
     value: number;
   }

   export type ExchangeRatesList = ExchangeRate[];
}
