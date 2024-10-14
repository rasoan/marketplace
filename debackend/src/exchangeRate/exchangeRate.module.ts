'use strict';

import { Module } from '@nestjs/common';

import { ExchangeRateService } from "./exchangeRate.service";
import { BaseHttpModule } from "../baseHttp/baseHttp.module";
import { ExchangeRateResolver } from "./exchangeRate.resolver";

@Module({
    imports: [
        BaseHttpModule,
    ],
    exports: [ ExchangeRateService ],
    providers: [ ExchangeRateService, ExchangeRateResolver ],
})
export class ExchangeRateModule {}
