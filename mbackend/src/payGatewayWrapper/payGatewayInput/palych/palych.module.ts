'use strict';

import { Module } from '@nestjs/common';
import { ConfigModule } from "@nestjs/config";
import { HttpModule } from "@nestjs/axios";

import { DatabaseModule } from "../../../database/database.module";
import { PalychService } from "./palych.service";
import { BaseHttpModule } from "../../../baseHttp/baseHttp.module";
import { FakeHttpModule } from "../../../baseHttp/fakeHttps.module";
import { TopUpAccountConfigModule } from "../../../topUpAccountConfig/topUpAccountConfig.module";

@Module({
        imports: [
            HttpModule,
            ConfigModule,
            DatabaseModule,
            BaseHttpModule,
            FakeHttpModule,
            TopUpAccountConfigModule,
        ],
        providers: [ PalychService ],
        exports: [ PalychService ]
    },
)
export class PalychModule {}
