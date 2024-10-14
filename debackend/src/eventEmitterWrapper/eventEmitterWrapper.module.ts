'use strict';

import { Module, Global } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { EventEmitterWrapperService } from "./eventEmitterWrapper.service";

@Global()
@Module({
    providers: [ EventEmitterWrapperService ],
    exports: [ EventEmitterWrapperService ],
    imports: [ EventEmitterModule.forRoot()]
})
export class EventEmitterWrapperModule {}
