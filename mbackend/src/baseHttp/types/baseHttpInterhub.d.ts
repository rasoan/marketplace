//
import {
    ExchangeTypes_Interhub,
} from "@deshopfrontend/src/utils/accountTopUps/constants";
import { AccountTopUpServiceInternalIdentifiers } from "@deshopfrontend/src/utils/topUpAccount/constants";

export namespace IBaseHttpInterhub {
    export interface RequestCheckData {
        /**
         * Идентификационный номер Сервиса (Передается со стороны InterHub)
         */
        service_id: AccountTopUpServiceInternalIdentifiers;
        /**
         * Аккаунт или номер телефона
         */
        account: string | number;
        /**
         * Идентификационный номер транзакции на стороне Агента.Этот id не повторяется, и каждая новая операция должна сопровождаться новым id.
         */
        agent_transaction_id: string;
        /**
         * Сумма, отправленная агентом
         */
        amount: number;
        /**
         * Если необходимо ввести дополнительную информацию помимо account и amount, то добавляется в этот параметр (не обязателен).
         */
        params?: object;
    }

    // todo: для этого таблицу создать
    export interface ResponseCheckData {
        /** Ответ от Биллинга "Success" */
        message: string,
        /** Логический признак ошибки обработки запроса */
        success: boolean,
        /** Статус платежа. Возвращает "успешно" или Код ошибки */
        status: number | string,
        /** Аккаунт отправленный агентом "550831976" */
        account: string,
        /** Сумма платежа (валюта от зависит договора) 1000.00 */
        amount: number,
        /** Идентификатор транзакции 1619421479155 */
        transaction_id: number,
        /** Сумма в валюте, которую клиент получает 1000.00 */
        amount_in_currency: number,
        /** Комиссия 0 */
        comission: number,
        /** Валюта услуги, за которую производилась оплата "USD" */
        currency: string,
    }

    export interface RequestPayData {
        /**
         * Идентификационный номер транзакции на стороне Агента.Этот id не повторяется, и каждая новая операция должна сопровождаться новым id.
         *
         * todo: в документации это number, но мне удобнее работать со строкой, попробуем кормить их строкой
         */
        agent_transaction_id: string;
    }

    export interface ResponsePayData {
        /**
         * Ответ от сервера
         */
        message: string,
        /**
         * Логический признак ошибки обработки запроса
         */
        success: boolean,
        /**
         * Статус транзакции. Здесь возвращается "успешно" или Код ошибки
         */
        status: number,
        /**
         * Дополнительные параметры или информация о транзакции
         */
        data?: object;
    }
}
