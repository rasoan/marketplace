'use strict';

import { Inject, Injectable } from '@nestjs/common';

import { TIME } from "@detools/common/polifils/DateTools_types.constants";
import { IExchangeRate } from "@deshopfrontend/src/utils/ExchangeRate/types/exchangeRate";
import { ExchangeRateWrapper } from "@deshopfrontend/src/utils/ExchangeRateWrapper/ExchangeRateWrapper";

import { getExchangeRates_forSteam } from "../topUpAccount/utils/utils";
import { BaseHttpService } from "../baseHttp/baseHttp.service";

@Injectable()
export class ExchangeRateService {
    @Inject(BaseHttpService)
    private readonly _httpService: BaseHttpService;
    /** Курсы валют по которым пополняются клиенты */
    private _exchangeRateForSteam__timeoutForSetInterval: ReturnType<typeof setInterval> | undefined;
    public isInit = false;
    public initializationPromise: Promise<unknown>;
    private _exchangeRateWrapper = new ExchangeRateWrapper({ exchangeRatesSteamList: [] });

    @_waitForInitMethodDecorator()
    public async getExchangeRates(): Promise<{
        exchangeRatesSteamList: IExchangeRate.ExchangeRatesList,
    }> {
        return {
            exchangeRatesSteamList: this._exchangeRateWrapper.exchangeRatesSteamList,
        };
    }

    @_waitForInitMethodDecorator()
    public async getExchangeRateWrapper() {
        return this._exchangeRateWrapper;
    }

    public async onModuleInit() {
        let resolvePromiseInitCallback = () => undefined as void | undefined;

        this.initializationPromise = new Promise(resolve => {
            resolvePromiseInitCallback = () => resolve(void 0);
        });

        const setExchangeRates_forSteamCallback = async () => {
            try {
                this._exchangeRateWrapper.exchangeRatesSteamList = await getExchangeRates_forSteam(this._httpService);
            }
            catch (error) {
                console.error(error);
            }
        };

        await setExchangeRates_forSteamCallback();

        this._exchangeRateForSteam__timeoutForSetInterval = setInterval(setExchangeRates_forSteamCallback, TIME.HOURS);

        this.isInit = true;

        resolvePromiseInitCallback();
    }

    public async onModuleDestroy() {
        if (this._exchangeRateForSteam__timeoutForSetInterval) {
            clearInterval(this._exchangeRateForSteam__timeoutForSetInterval);
        }

        this.isInit = false;
    }
}

/**
 * Для вызовов функций
 */
function _waitForInitMethodDecorator(): MethodDecorator {
    return function(target: unknown, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;

        descriptor.value = async function(...args: unknown[]) {
            await _checkIsInit(this, propertyKey);

            return originalMethod.apply(this, args);
        };

        return descriptor;
    };
}

async function _checkIsInit(topUpsService: ExchangeRateService, propertyKey: string) {
    if (!topUpsService.isInit) {
        console.log(`Waiting for initialization "TopUpsService" before calling ${String(propertyKey)}...`);

        await topUpsService.initializationPromise;

        console.log(`Initialization "TopUpsService" was successfully, we calling ${String(propertyKey)}`);
    }
}
