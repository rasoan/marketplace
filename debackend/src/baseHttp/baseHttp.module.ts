'use strict';

import { Module } from '@nestjs/common';
import { HttpModule } from "@nestjs/axios";
import { ConfigModule } from "@nestjs/config";

import { BaseHttpService } from "./baseHttp.service";
import { FakeHttpModule } from "./fakeHttps.module";

@Module({
        imports: [
            HttpModule,
            ConfigModule,
            FakeHttpModule,
        ],
        providers: [ BaseHttpService ],
        exports: [ BaseHttpService ],
    },
)
export class BaseHttpModule {}
