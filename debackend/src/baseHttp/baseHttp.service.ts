'use strict';

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import { Observable } from 'rxjs';

import { assertIsDefined } from "@detools/type_guards/base";
import { FakeHttpService } from "./fakeHttps.service";

@Injectable()
export class BaseHttpService {
    constructor(
        private _configService: ConfigService,
        private _httpService: HttpService,
        private _fakeHttpService: FakeHttpService,
    ) {
        const nodeEnv = this._configService.get<string>('NODE_ENV');

        assertIsDefined(nodeEnv, "nodeEnv is not defined!");

        // this._httpService = this._fakeHttpService as unknown as HttpService;

        if (nodeEnv === 'dev') {
            this._httpService = this._fakeHttpService as unknown as HttpService;
        }
        else if (nodeEnv === 'prod') {
            this._httpService = new HttpService();
        }
        else {
            throw new Error("Unknown mode!");
        }
    }

    public get<T = unknown>(url: string, config?: AxiosRequestConfig): Observable<AxiosResponse<T>> {
        return this._httpService.get(url, config);
    }

    public post<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Observable<AxiosResponse<T>> {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return this._httpService.post(url, data, config);
    }
}
