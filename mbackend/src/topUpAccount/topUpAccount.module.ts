'use strict';

import { Module } from '@nestjs/common';

import { DatabaseModule } from "../database/database.module";
import { TopUpAccountResolver } from "./topUpAccount.resolver";
import { TopUpAccountService } from "./topUpAccount.service";
import { BaseHttpModule } from "../baseHttp/baseHttp.module";
import { ExchangeRateModule } from "../exchangeRate/exchangeRate.module";
import { ExchangeRateService } from "../exchangeRate/exchangeRate.service";
import { PayGatewayWrapperModule } from "../payGatewayWrapper/payGatewayWrapper.module";
import { PayGatewayWrapperService } from "../payGatewayWrapper/payGatewayWrapper.service";
import { InterhubModule } from "../payGatewayWrapper/payGatewayOutput/interhub/interhub.module";
import { PalychModule } from "../payGatewayWrapper/payGatewayInput/palych/palych.module";
import { AntilopayModule } from "../payGatewayWrapper/payGatewayInput/antilopay/antilopay.module";

@Module({
        imports: [
            DatabaseModule,
            BaseHttpModule,
            ExchangeRateModule,
            PayGatewayWrapperModule,
            InterhubModule,
            PalychModule,
            AntilopayModule,
        ],
        providers: [
            TopUpAccountService,
            ExchangeRateService,
            DatabaseModule,
            PayGatewayWrapperService,
            TopUpAccountResolver,
        ],
    },
)
export class TopUpAccountModule {}
