'use strict';

import { Field, ObjectType } from "@nestjs/graphql";
import { IsNumber } from "class-validator";

import { IExchangeRate } from "@deshopfrontend/src/utils/ExchangeRate/types/exchangeRate";

import { IExchangeRateModelsOutput } from "../types/exchangeRate";

@ObjectType()
export class ExchangeRate implements IExchangeRate.ExchangeRate {
    @Field()
    @IsNumber()
    type: number;
    @Field()
    @IsNumber()
    value: number;
}

@ObjectType()
export class ExchangeRateSteamOutput implements IExchangeRateModelsOutput.ExchangeRate {
    @Field(() => [ ExchangeRate ])
    exchangeRatesSteamList: ExchangeRate[];
}
