'use strict';

import { Module } from '@nestjs/common';
import { HttpModule } from "@nestjs/axios";

import { DatabaseModule } from "../../../database/database.module";
import { BaseHttpModule } from "../../../baseHttp/baseHttp.module";
import { InterhubService } from "./interhub.service";
import { FakeHttpModule } from "../../../baseHttp/fakeHttps.module";

@Module({
        imports: [
            DatabaseModule,
            BaseHttpModule,
            HttpModule,
            FakeHttpModule,
        ],
        providers: [
            InterhubService,
            DatabaseModule,
        ],
        exports: [ InterhubService ],
    },
)
export class InterhubModule {}
