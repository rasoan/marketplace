//

import { AccountTypes_Palych, ExchangeTypes_Palych } from "@deshopfrontend/src/utils/accountTopUps/constants";

import { PalychPostbackNotification_Statuses } from "../../topUps/types/constants";

export namespace IBaseHttpPalych {
    export interface RequestBillCreateData {
        /**
         * Payment amount
         *
         * - "123.45"
         */
        amount: number;
        /**
         * Unique order ID. Will be sent within Postback.
         * "123"
         */
        order_id?: string;
        /**
         * Type of payment link shows how many payments it could receive.
         * 'normal' type means that only one successful payment could be received for this link.
         * 'multi' type means that many payments could be received with one link.
         * - "multi"
         */
        type?: "multi";
        /**
         * Unique shop ID
         *
         * "EG8vrGXmLR"
         */
        shop_id: string;
        /**
         *  Description of payment
         */
        description?: string;
        /**
         * You can send any string value in this field and it will be returned within postback.
         */
        custom?: string;
        // todo: добавил
        /**
         * Currency that customer sees during payment process.
         * If you skip this parameter in your request, the default currency of your Shop will be used during the payment process.
         * In case where shop_id doesn't exist, customer will pay in RUB.
        */
        currency_in?: string;
        /** Flag that sets who pays commission. */
        payer_pays_commission?: 1 | 0;
        /**
         * You can send email in request, so customer will see it's already pre-filled on the payment page.
         */
        payer_email?: string;
        /**
         * Please specify the purpose of the payment. It will be shown on the payment form.
         */
        name?: string;
    }

    export interface ResponseBillCreateData {
        /**
         * Payment status
         *
         * true
         */
        success: boolean,
        /** Ссылка на страницу оплаты с QR-code "https://palych.io/link/GkLWvKx3" */
        link_url: string,
        /** Ссылка на страницу оплаты "https://palych.io/transfer/GkLWvKx3" */
        link_page_url: string,
        /**
         * 	Unique bill ID
         *
         * 	"GkLWvKx3"
         */
        bill_id: string,
    }

    // todo: перепроверил, готово!
    /** Входящий пост запрос от Palych о том, что платёжка прошла */
    export interface PostbackPaymentNotificationData {
        /**
         * Unique order ID that you sent when you created a bill
         *
         * 123
         */
        InvId: string; // todo: Number на стринг заменил
        /**
         * Payment amount
         *
         * 12345
         */
        OutSum: number;
        /**
         * Payment currency
         *
         * "RUB"
         */
        CurrencyIn: string;
        /**
         * Transaction fees
         *
         * 123
         */
        Commission: number;
        /**
         * Currency of payment
         *
         */
        Currency: string;
        /**
         * Unique transaction ID
         *
         * "AbxvAM6vJk"
         */
        TrsId: string;
        /**
         * Payment status
         *
         * "SUCCESS"
         */
        Status: string;
        /**
         * If you sent something in 'custom' filed when you created a bill, you will get this information back in the postback
         *
         * "custom_information"
         */
        custom?: string;
        /**
         * Information about payment method
         *
         * "BANK_CARD"
         */
        AccountType: string;
        /**
         * Payment account that customer used
         *
         * 220220******7046
         */
        AccountNumber: string;
        /**
         * Amount that top up you balance after success payment
         *
         * "123"
         */
        BalanceAmount: number;
        /**
         * Balance currency
         *
         * "RUB"
         */
        BalanceCurrency: string;
        /**
         * Error code
         *
         */
        ErrorCode?: number;
        /**
         * Error decsription
         *
         */
        ErrorMessage?: string; // todo: добавил
        /**
         * Signature. You can verify the postback that you received
         *
         * "398320589F8E31ACE27CC681BCBD8BDA"
         */
        SignatureValue: string;
    }
}
