'use strict';

import type { IBaseHttpPalych } from "../baseHttp/types/baseHttpPalych";
import type { IAntilopayService } from "./payGatewayInput/antilopay/types/antilopay.service";

import { Body, Controller, HttpStatus, Inject, Post, Res } from '@nestjs/common';
import { Response } from 'express';

import { assertIsDefined } from "@detools/type_guards/base";

import { PayGatewayWrapperService } from "./payGatewayWrapper.service";

const PALYCH_NOTIFICATION_POSTBACK_PAY_URL = process.env.PALYCH_NOTIFICATION_POSTBACK_PAY_URL;
const ANTILOPAY_NOTIFICATION_POSTBACK_PAY_URL = process.env.ANTILOPAY_NOTIFICATION_POSTBACK_PAY_URL;

assertIsDefined(PALYCH_NOTIFICATION_POSTBACK_PAY_URL, "PALYCH_NOTIFICATION_POSTBACK_PAY_URL");
assertIsDefined(ANTILOPAY_NOTIFICATION_POSTBACK_PAY_URL, "ANTILOPAY_NOTIFICATION_POSTBACK_PAY_URL");

@Controller()
export class PayGatewayWrapperController {
    @Inject(PayGatewayWrapperService)
    private _payGatewayWrapperService: PayGatewayWrapperService;

    @Post(PALYCH_NOTIFICATION_POSTBACK_PAY_URL)
    @TryCatch()
    public async postbackNotificationPalych(
        @Body() postbackData: IBaseHttpPalych.PostbackPaymentNotificationData,
        @Res() response: Response,
    ) {
        return this._payGatewayWrapperService.postbackNotificationPalych(postbackData);
    }

    @Post(ANTILOPAY_NOTIFICATION_POSTBACK_PAY_URL)
    @TryCatch()
    public async postbackNotificationAntilopay(
        @Body() postbackData: IAntilopayService.PostbackNotificationOptions,
        @Res() response: Response,
    ) {
        return this._payGatewayWrapperService.postbackNotificationAntilopay(postbackData);
    }
}

export function TryCatch() {
    return function(
        _,
        __,
        descriptor: PropertyDescriptor
    ) {
        const originalMethod = descriptor.value;

        descriptor.value = async function(...args: [ unknown, Response ]) {
            const response: Response = args[1];

            try {
                await originalMethod.apply(this, args);

                if (!response.headersSent) {
                    response.status(HttpStatus.OK).send('Postback notification processed successfully');
                }
            }
            catch (error) {
                response.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error.message);
            }
        };

        return descriptor;
    };
}
