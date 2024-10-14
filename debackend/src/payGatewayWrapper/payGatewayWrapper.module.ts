'use strict';

import { Global, Module } from '@nestjs/common';

import { InterhubModule } from "./payGatewayOutput/interhub/interhub.module";
import { PalychModule } from "./payGatewayInput/palych/palych.module";
import { PayGatewayWrapperService } from "./payGatewayWrapper.service";
import { BaseHttpModule } from "../baseHttp/baseHttp.module";
import { DatabaseModule } from "../database/database.module";
import { AntilopayModule } from "./payGatewayInput/antilopay/antilopay.module";
import { PayGatewayWrapperController } from "./payGatewayWrapper.controller";

@Global()
@Module({
        imports: [
            InterhubModule,
            PalychModule,
            AntilopayModule,
            BaseHttpModule,
            DatabaseModule,
        ],
        providers: [
            PayGatewayWrapperService,
        ],
        controllers: [ PayGatewayWrapperController ],
    },
)
export class PayGatewayWrapperModule {}
