'use strict';

import type { IBaseHttpSteam } from "../../baseHttp/types/baseHttpSteam";

import { lastValueFrom } from "rxjs";
import { AxiosResponse } from "axios";

import { CurrencyType } from "@deshopfrontend/src/utils/constants";
import { assertIsDefined, assertIsNumberType } from "@detools/type_guards/base";
import { normalizeNumberFloat } from "@deshopfrontend/src/utils/topUpAccount/topUpAccount";
import { IExchangeRate } from "@deshopfrontend/src/utils/ExchangeRate/types/exchangeRate";

import { BaseHttpService } from "../../baseHttp/baseHttp.service";
import {
    steam_getSteamLowestPriceItemKztUrl,
    steam_getSteamLowestPriceItemRubUrl,
    steam_getSteamLowestPriceItemUahUrl,
    steam_getSteamLowestPriceItemUsdUrl,
} from "../types/constants";

async function _getSteamLowestPriceRaw(httpService: BaseHttpService, exchangeType: CurrencyType): Promise<string> {
    let steamLowestPriceItemUrl: string | undefined = void 0;

    switch (exchangeType) {
        case CurrencyType.Rub: {
            steamLowestPriceItemUrl = steam_getSteamLowestPriceItemRubUrl;

            break;
        }
        case CurrencyType.Usd: {
            steamLowestPriceItemUrl = steam_getSteamLowestPriceItemUsdUrl;

            break;
        }
        case CurrencyType.Uah: {
            steamLowestPriceItemUrl = steam_getSteamLowestPriceItemUahUrl;

            break;
        }
        case CurrencyType.Kzt: {
            steamLowestPriceItemUrl = steam_getSteamLowestPriceItemKztUrl;

            break;
        }
    }

    assertIsDefined(steamLowestPriceItemUrl, "steamLowestPriceItemUrl is not defined!");

    const steamLowestPriceItem = httpService.get<IBaseHttpSteam.ResponseGetCostItemData>(steamLowestPriceItemUrl);
    const {
        data: {
            lowest_price,
        },
    } = await lastValueFrom<AxiosResponse<IBaseHttpSteam.ResponseGetCostItemData>>(steamLowestPriceItem);

    assertIsDefined(lowest_price, "lowest_price is not defined!");

    return lowest_price;
}

// todo: перестать после запятой выкидывать мелочь - курс станет чуточку точнее
function normaliseLowestPrice(lowestPrice_raw: string, exchangeType: CurrencyType): number {
    let lowestPrice_result: number | undefined = void 0;

    switch (exchangeType) {
        case CurrencyType.Rub: {
            /** "129912,23 pуб." выкинули копейки после запятой и получили "129912" */
            const [ lowestPrice_string ] = lowestPrice_raw.split(",");

            lowestPrice_result = parseFloat(lowestPrice_string);

            break;
        }
        case CurrencyType.Usd: {
            /** "$1,466.27" - выкинули запятую и получили "$1466.27" */
            const lowestPrice_stringWithoutDecimal = lowestPrice_raw.replace(/\,/, '');

            /* Избавляемся от всего кроме цифр и точек (по факту знак доллара убираем) */
            lowestPrice_result = parseFloat(lowestPrice_stringWithoutDecimal.replace(/[^0-9.]/g, ''));

            break;
        }
        case CurrencyType.Uah: {
            /** "63 614,24₴" - выкинули запятую и получили "63 614" */
            const [ lowestPrice_string ] = lowestPrice_raw.split(",");

            lowestPrice_result = parseFloat(lowestPrice_string.replace(/[^0-9.]/g, ''));

            break;
        }
        case CurrencyType.Kzt: {
            /** "736 898,04₸" - выкинули запятую и получили "736 898" */
            const [ lowestPrice_string ] = lowestPrice_raw.split(",");

            lowestPrice_result = parseFloat(lowestPrice_string.replace(/[^0-9.]/g, ''));

            break;
        }
    }

    assertIsNumberType(lowestPrice_result, { isPositiveCheck: true });

    return lowestPrice_result;
}

function lowestPriceToExchangeRate(options: {
    /** Здесь стоимость в Rub, Kzt и т.д. */
    lowestPriceTarget: number,
    /** Здесь стоимость в Usd только и всегда */
    lowestPriceBase: number,
}) {
    const {
        lowestPriceTarget,
        lowestPriceBase,
    } = options;

    const exchangeRate_resultRaw = parseFloat(
        /*Рос рубли в копейках, поэтому делим на 100, что бы получить именно рубли, а не копейки*/
        // eslint-disable-next-line no-magic-numbers
        (lowestPriceTarget / lowestPriceBase)
            /* Оставляем 3 десятка после запятой, остальное выбрасываем */
            // eslint-disable-next-line no-magic-numbers
            .toFixed(2)
    );

    return normalizeNumberFloat(exchangeRate_resultRaw);
}

export async function getExchangeRates_forSteam(httpService: BaseHttpService): Promise<IExchangeRate.ExchangeRatesList> {
    const lowestPriceRaw_usd = await _getSteamLowestPriceRaw(httpService, CurrencyType.Usd);
    const lowestPriceRaw_rub = await _getSteamLowestPriceRaw(httpService, CurrencyType.Rub);
    const lowestPriceRaw_kzt = await _getSteamLowestPriceRaw(httpService, CurrencyType.Kzt);
    const lowestPriceRaw_uah = await _getSteamLowestPriceRaw(httpService, CurrencyType.Uah);

    const lowestPrice_rub = normaliseLowestPrice(lowestPriceRaw_rub, CurrencyType.Rub);
    const lowestPrice_usd = normaliseLowestPrice(lowestPriceRaw_usd, CurrencyType.Usd);
    const lowestPrice_uah = normaliseLowestPrice(lowestPriceRaw_uah, CurrencyType.Uah);
    const lowestPrice_kzt = normaliseLowestPrice(lowestPriceRaw_kzt, CurrencyType.Kzt);

    const exchangeRate_rub = lowestPriceToExchangeRate({
        lowestPriceTarget: lowestPrice_rub,
        lowestPriceBase: lowestPrice_usd,
    });
    const exchangeRate_usd = lowestPriceToExchangeRate({
        lowestPriceTarget: lowestPrice_usd,
        lowestPriceBase: lowestPrice_usd,
    });
    const exchangeRate_kzt = lowestPriceToExchangeRate({
        lowestPriceTarget: lowestPrice_kzt,
        lowestPriceBase: lowestPrice_usd,
    });
    const exchangeRate_uah = lowestPriceToExchangeRate({
        lowestPriceTarget: lowestPrice_uah,
        lowestPriceBase: lowestPrice_usd,
    });

    return [
        {
            value: exchangeRate_rub,
            type: CurrencyType.Rub,
        },
        {
            value: exchangeRate_usd,
            type: CurrencyType.Usd,
        },
        {
            value: exchangeRate_kzt,
            type: CurrencyType.Kzt,
        },
        {
            value: exchangeRate_uah,
            type: CurrencyType.Uah,
        },
    ];
}
