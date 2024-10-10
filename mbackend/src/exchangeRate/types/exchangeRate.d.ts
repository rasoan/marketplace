//
import { IExchangeRate } from "@deshopfrontend/src/utils/ExchangeRate/types/exchangeRate";

export namespace IExchangeRateModelsOutput {
    export interface ExchangeRate {
        // todo: вынести курсы из ITopUpAccount сюда (на фронте в соответствующее место)
        exchangeRatesSteamList: IExchangeRate.ExchangeRatesList;
    }
}
