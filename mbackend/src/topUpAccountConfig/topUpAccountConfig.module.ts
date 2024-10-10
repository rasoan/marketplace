'use strict';

import { Module, Global } from '@nestjs/common';

import { TopUpAccountConfigService } from "./topUpAccountConfig.service";
import { TopUpAccountConfigResolver } from "./topUpAccountConfig.resolver";

@Global()
@Module({
    exports: [ TopUpAccountConfigService ],
    providers: [ TopUpAccountConfigService, TopUpAccountConfigResolver ],
})
export class TopUpAccountConfigModule {}
