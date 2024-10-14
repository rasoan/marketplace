'use strict';

import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { FakeHttpService } from "./fakeHttps.service";

@Module({
        imports: [
            HttpModule,
            ConfigModule,
        ],
        providers: [ FakeHttpService ],
        exports: [ FakeHttpService ],
    },
)
export class FakeHttpModule {}
