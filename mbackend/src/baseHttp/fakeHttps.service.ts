'use strict';

import { AxiosHeaders, AxiosRequestConfig, AxiosResponse } from "axios";
import { lastValueFrom, Observable, of } from "rxjs";
import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { assertIsDefined } from "@detools/type_guards/base";
import {
    AccountTypes_Palych,
    ExchangeTypes_Interhub,
    ExchangeTypes_Palych,
} from "@deshopfrontend/src/utils/topUpAccount/constants";
import { TIME } from "@detools/common/polifils/DateTools_types.constants";

import { IBaseHttpPalych } from "./types/baseHttpPalych";
import { IBaseHttpInterhub } from "./types/baseHttpInterhub";
import { IBaseHttpSteam } from "./types/baseHttpSteam";
import {
    antilopay_createBillRequestUrl,
    interhub_checkRequestUrl,
    interhub_payRequestUrl,
    palych_createBillRequestUrl,
    PalychPostbackNotification_Statuses,
    steam_getSteamLowestPriceItemKztUrl,
    steam_getSteamLowestPriceItemRubUrl,
    steam_getSteamLowestPriceItemUahUrl,
    steam_getSteamLowestPriceItemUsdUrl,
} from "../topUpAccount/types/constants";
import { IAntilopayService } from "../payGatewayWrapper/payGatewayInput/antilopay/types/antilopay.service";
import {
    Antilopay_RequestResultCodeType,
    Antilopay_PayStatusCode,
} from "../payGatewayWrapper/payGatewayInput/antilopay/types/constants";

@Injectable()
export class FakeHttpService {
    private _currentBackendUrl: string;
    private _palychNotificationPostbackPayUrl: string;
    private _antilopayNotificationPostbackPayUrl: string;

    constructor(
        private _configService: ConfigService,
        /**
         * !!!
         * !!! Настоящий http сервис, ОСТОРОЖНО, он отправляет реальные запросы !!!
         * !!!
         */
        private _realHttpService: HttpService,
    ) {
        const backendContainerName = this._configService.get<string>('BACKEND_CONTAINER_NAME');
        const backendPort = this._configService.get<string>('NEXT_PUBLIC_BACKEND_INTERNAL_PORT');
        const palychNotificationPostbackPayUrl = this._configService.get<string>('PALYCH_NOTIFICATION_POSTBACK_PAY_URL');
        const antilopayNotificationPostbackPayUrl = this._configService.get<string>('ANTILOPAY_NOTIFICATION_POSTBACK_PAY_URL');

        assertIsDefined(backendPort, "backendPort is not defined!");
        assertIsDefined(backendContainerName, "backendContainerName is not defined!");
        assertIsDefined(palychNotificationPostbackPayUrl, "palychNotificationPostbackPayUrl is not defined!");
        assertIsDefined(antilopayNotificationPostbackPayUrl, "antilopayNotificationPostbackPayUrl is not defined!");

        this._currentBackendUrl = `http://${backendContainerName}:${backendPort}`;
        this._palychNotificationPostbackPayUrl = palychNotificationPostbackPayUrl;
        this._antilopayNotificationPostbackPayUrl = antilopayNotificationPostbackPayUrl;
    }

    // eslint-disable-next-line class-methods-use-this
    public get(url: string, config?: AxiosRequestConfig): Observable<AxiosResponse> {
        let fakeData: IBaseHttpSteam.ResponseGetCostItemData
            | undefined = void 0
        ;

        assertHeaders(url, config);

        // Стоимость item в долларах
        if (url.includes(steam_getSteamLowestPriceItemUsdUrl)) {
            fakeData = {
                success: true,
                lowest_price: "$1,466.27",
            };
        }
        // Стоимость item в рублях
        else if (url.includes(steam_getSteamLowestPriceItemRubUrl)) {
            fakeData = {
                success: true,
                lowest_price: "136822,11 руб",
            };
        }
        else if (url.includes(steam_getSteamLowestPriceItemUahUrl)) {
            fakeData = {
                success: true,
                lowest_price: "63 614,24₴",
            };
        }
        else if (url.includes(steam_getSteamLowestPriceItemKztUrl)) {
            fakeData = {
                success: true,
                lowest_price: "736 898,04₸",
            };
        }

        const headers = new AxiosHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer fake-token',
            ...config?.headers,
        });

        const fakeResponse: AxiosResponse = {
            data: fakeData,
            status: 200,
            statusText: 'OK',
            headers: {},
            config: {
                url: url,
                method: 'get',
                headers,
                params: config?.params || {},
                data: config?.data || {},
                timeout: config?.timeout || 0,
                baseURL: config?.baseURL || '',
            },
        };

        return of(fakeResponse);
    }

    // eslint-disable-next-line class-methods-use-this
    public post(url: string, data?: object, config?: AxiosRequestConfig): Observable<AxiosResponse> {
        const headers = new AxiosHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer fake-token',
            ...config?.headers,
        });
        const data_response = getDataResponseByUrl(url, data);

        assertHeaders(url, config);

        // todo: каждый из этих if является тупо функцией, расхардкодить и создать функцию
        if (checkIsPalychBillCreateUrl(url)) {
            setTimeout(() => {
                const {
                    amount,
                    currency_in,
                    order_id,
                } = data as IBaseHttpPalych.RequestBillCreateData;

                const data_postbackNotification: IBaseHttpPalych.PostbackPaymentNotificationData = {
                    "AccountNumber": `${Date.now()}******7046`,
                    "TrsId": `Abxv${Date.now()}AM6vJk`,
                    "Status": PalychPostbackNotification_Statuses.Success,
                    "OutSum": amount,
                    // todo: это что?
                    "SignatureValue": "398320589F8E31ACE27CC681BCBD8BDA",
                    "InvId": String(order_id),
                    "CurrencyIn": currency_in || ExchangeTypes_Palych.Rub,
                    "Commission": 0,
                    "BalanceCurrency": ExchangeTypes_Palych.Rub,
                    "BalanceAmount": amount,
                    // todo: вынести в enum
                    "AccountType": AccountTypes_Palych.BANK_CARD,
                    "Currency": ExchangeTypes_Palych.Rub,
                };

                // С postman так же запрос идёт по url "http://localhost/api/notification_payplych", там он правда в nginx прокидывает
                const result = this._realHttpService.post(`${this._currentBackendUrl}/${this._palychNotificationPostbackPayUrl}`, data_postbackNotification);

                lastValueFrom(result).catch(error => {
                    console.error(error);
                });
            }, TIME.SECONDS_2);
        }
        else if (checkIsAntilopayCreateBillUrl(url)) {
            setTimeout(() => {
                const {
                    currency,
                    order_id,
                    product_name,
                    description,
                    amount,
                    customer: {
                        email,
                    },
                } = data as IAntilopayService.CreateBillRequestData;

                const data_postbackNotification: IAntilopayService.PostbackNotificationOptions = {
                    type: "payment",
                    payment_id: (data_response as IAntilopayService.ICreateBillResponseData).payment_id,
                    order_id: order_id,
                    ctime: "ctime test",
                    amount: amount,
                    original_amount: amount,
                    fee: 0,
                    status: Antilopay_PayStatusCode.SUCCESS,
                    currency,
                    product_name,
                    description,
                    pay_method: "card",
                    pay_data: "pay_data test",
                    customer_ip: "12.12.232.22",
                    customer_useragent: "test customer_useragent",
                    customer: {
                        email,
                    },
                };

                // С postman так же запрос идёт по url "http://localhost/api/notification_payplych", там он правда в nginx прокидывает
                const result = this._realHttpService.post(`${this._currentBackendUrl}/${this._antilopayNotificationPostbackPayUrl}`, data_postbackNotification);

                lastValueFrom(result).catch(error => {
                    console.error(error);
                });
            }, TIME.SECONDS_2);
        }

        return of({
            data: data_response,
            status: 201,
            statusText: 'Created',
            headers,
            config: {
                url: url,
                method: 'post',
                headers,
                params: config?.params || {},
                data: config?.data || {},
                timeout: config?.timeout || 0,
                baseURL: config?.baseURL || '',
            },
        });
    }
}

type IResponseData = IBaseHttpPalych.ResponseBillCreateData
    | IBaseHttpInterhub.ResponseCheckData
    | IBaseHttpInterhub.ResponsePayData
    | IBaseHttpSteam.ResponseGetCostItemData
    // todo: видишь, IAntilopayService на месте, остальные так же разнести по папкам
    | IAntilopayService.ICreateBillResponseData
;

function getDataResponseByUrl<T extends IResponseData>(url: string, dataRequest?: object): T {
    // Palych bill create
    if (checkIsPalychBillCreateUrl(url)) {
        const data: IBaseHttpPalych.ResponseBillCreateData = {
            success: true,
            link_url: "https://palych.io/link/GkLWvKx3",
            link_page_url: "https://palych.io/transfer/GkLWvKx3",
            bill_id: "GkLWvKx3",
        };

        return data as T;
    }
    else if (checkIsAntilopayCreateBillUrl(url)) {
        const data: IAntilopayService.ICreateBillResponseData = {
            code: Antilopay_RequestResultCodeType.Success,
            payment_id: `APAY4A${Date.now()}`,
            payment_url: "https://gate.antilopay.com/#payment/APAY4AA6BB4B1701155257296",
        };

        return data as T;
    }
    // Interhub check
    else if (url.includes(interhub_checkRequestUrl)) {
        const {
            amount,
            account,
            agent_transaction_id,
        } = dataRequest as IBaseHttpInterhub.RequestCheckData;

        const data: IBaseHttpInterhub.ResponseCheckData = {
            message: "Success",
            success: true,
            status: 0,
            account: String(account),
            amount: amount,
            transaction_id: Date.now(),
            amount_in_currency: amount,
            comission: 0,
            currency: ExchangeTypes_Interhub.Usd,
        };

        return data as T;
    }
    // Interhub pay
    else if (url.includes(interhub_payRequestUrl)) {
        const data: IBaseHttpInterhub.ResponsePayData = {
            message: "Transaction is success",
            success: true,
            status: 0,
            data: { test: "hello world" },
        };

        return data as T;
    }
    // Не поддерживаемый запрос в рамках dev режима
    else {
        throw new Error("Unknown url path for FAKE post!");
    }
}

function assertHeaders(url: string, config?: AxiosRequestConfig) {
    if (url.includes("palych.io")) {
        assertIsDefined(config?.headers?.Authorization, "No Authorization property, for fake api palych!");
    }
    else if (url.includes("api.interhub.uz")) {
        assertIsDefined(config?.headers?.token, "No token, for fake api interhub!");
    }
}

function checkIsPalychBillCreateUrl(url: string): boolean {
    return url.includes(palych_createBillRequestUrl);
}

function checkIsAntilopayCreateBillUrl(url: string): boolean {
    return url.includes(antilopay_createBillRequestUrl);
}
