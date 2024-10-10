'use strict';

import { Module } from '@nestjs/common';
import { HttpModule } from "@nestjs/axios";
import { ConfigModule } from "@nestjs/config";

import { DatabaseModule } from "../../../database/database.module";
import { BaseHttpModule } from "../../../baseHttp/baseHttp.module";
import { AntilopayService } from "./antilopay.service";
import { TopUpAccountConfigModule } from "../../../topUpAccountConfig/topUpAccountConfig.module";

@Module({
        imports: [
            DatabaseModule,
            HttpModule,
            ConfigModule,
            BaseHttpModule,
            TopUpAccountConfigModule,
        ],
        providers: [ AntilopayService ],
        exports: [ AntilopayService ],
    },
)
export class AntilopayModule {}
