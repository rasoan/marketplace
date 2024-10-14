/* eslint-disable no-magic-numbers */

export const enum PalychPostbackNotification_Statuses {
    /** Транзакция успешно завершена */
    Success = 'SUCCESS',
    /** Сумма, полученная по транзакции, меньше ожидаемой */
    Underpaid = 'UNDERPAID',
    /** Сумма, полученная по транзакции, больше ожидаемой */
    Overpaid = 'OVERPAID',
    /** Транзакция завершилась с ошибкой */
    Fail = 'FAIL',
}

export const interhub_servicesListRequestUrl = "https://api.interhub.uz/api/agent/service/list";
export const interhub_checkRequestUrl = "https://api.interhub.uz/api/payment/check";
export const interhub_payRequestUrl = "https://api.interhub.uz/api/payment/pay";
export const palych_createBillRequestUrl = "https://palych.io/api/v1/bill/create";
export const antilopay_createBillRequestUrl = "https://lk.antilopay.com/api/v1/payment/create";
/** RUB Currency = 5 */
export const steam_getSteamLowestPriceItemRubUrl = "https://steamcommunity.com/market/priceoverview/?appid=570&currency=5&market_hash_name=Corrupted%20Tail%20of%20the%20Ironbarde%20Charger";
/** USD Currency = 1 */
export const steam_getSteamLowestPriceItemUsdUrl = "https://steamcommunity.com/market/priceoverview/?appid=570&currency=1&market_hash_name=Corrupted%20Tail%20of%20the%20Ironbarde%20Charger";
/** UAH Currency = 18 */
export const steam_getSteamLowestPriceItemUahUrl = "https://steamcommunity.com/market/priceoverview/?appid=570&currency=18&market_hash_name=Corrupted%20Tail%20of%20the%20Ironbarde%20Charger";
/** KZT Currency = 37 */
export const steam_getSteamLowestPriceItemKztUrl = "https://steamcommunity.com/market/priceoverview/?appid=570&currency=37&market_hash_name=Corrupted%20Tail%20of%20the%20Ironbarde%20Charger";
