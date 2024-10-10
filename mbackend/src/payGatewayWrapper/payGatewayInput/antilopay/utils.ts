'use strict';

import { AxiosRequestConfig } from "axios";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const crypto = require('crypto');

export class PayGatewayInputAntilopayUtils {
    /**
     *
     *
     * @return - возвращаемое значение передавать в заголовке X-Apay-Sign.
     * @param options
     */
    public static createKey(options: {
        payload: object,
        secretKey: string,
    }) {
        const {
            payload,
            secretKey,
        } = options;

        const requestBodyString = JSON.stringify(payload);
        const data = Buffer.from(requestBodyString);
        const privateKey = `-----BEGIN RSA PRIVATE KEY-----\n${secretKey}\n-----END RSA PRIVATE KEY-----`;

        return crypto.sign('RSA-SHA256', data, privateKey).toString("base64");
    }

    public static createHeader(options: {
        payload: object,
        secretKey: string,
        secretId: string,
    }): AxiosRequestConfig {
        const {
            secretId,
        } = options;
        const signature = PayGatewayInputAntilopayUtils.createKey(options);

        return {
            headers: {
                'X-Apay-Secret-Id': secretId,
                'X-Apay-Sign': signature,
                'X-Apay-Sign-Version': '1',
            },
        };
    }

    /**
     * SHA-256 в шестнадцатеричном формате (hex): длина всегда 64 символа.
     */
    public static generateUniqueValue(payload: object) {
        return crypto.createHash('sha256')
            .update(JSON.stringify(payload))
            .digest('hex')
        ;
    }
}

