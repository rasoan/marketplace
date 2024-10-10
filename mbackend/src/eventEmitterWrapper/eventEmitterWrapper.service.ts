'use strict';

import type { IEventEmitterWrapper } from "./types/eventEmitterWrapper";

import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from "@nestjs/event-emitter";

import { SHOP_BACKEND_EVENTS } from "./types/constants";

@Injectable()
export class EventEmitterWrapperService {
    public payGatewayInputEventEmitterWrapper: PayGatewayInputEventEmitterWrapper;

    constructor(
        private _eventEmitter: EventEmitter2,
    ) {
        this.payGatewayInputEventEmitterWrapper = new PayGatewayInputEventEmitterWrapper(this._eventEmitter);
    }

    private onModuleDestroy() {
        this._eventEmitter.removeAllListeners();
    }
}

class PayGatewayInputEventEmitterWrapper {
    private _eventEmitter: EventEmitter2;

    constructor(eventEmitter: EventEmitter2) {
        this._eventEmitter = eventEmitter;
    }

    public emitSuccessPay(options: IEventEmitterWrapper.PayGatewayInputSuccessEventOptions) {
        const {
            eventData,
        } = options;

        this._eventEmitter.emit(
            SHOP_BACKEND_EVENTS.PAY_GATEWAY_INPUT_SUCCESS,
            eventData,
        );
    }

    public onSuccessPay(callback: IEventEmitterWrapper.OnPayGatewayInputSuccessCallback) {
        this._eventEmitter.on(
            SHOP_BACKEND_EVENTS.PAY_GATEWAY_INPUT_SUCCESS,
            callback,
        );
    }
}
