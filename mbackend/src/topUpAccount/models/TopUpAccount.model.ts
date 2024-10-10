'use strict';

import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';
import { ObjectType, Field, InputType } from '@nestjs/graphql';

import { ITopUpAccount } from "@deshopfrontend/src/utils/topUpAccount/types/topUpAccount";
import { IExchangeRate } from "@deshopfrontend/src/utils/ExchangeRate/types/exchangeRate";

import {
    IPalychPostbackNotificationEvent,
    ITopUpAccountInput,
    ITopUpAccountOutput,
    ITopUpModelsOutput,
} from "../types/topUpAccount";
// todo: пусть Eslint Заставляет добавлять type, но js сборка не сыпется в nest из-за этого

@InputType()
export class TopUpAccountInput implements ITopUpAccountInput {
    @Field()
    @IsNumber()
    amount: number;
    @Field()
    @IsString()
    account: string;
    @Field()
    @IsString()
    email: string;
    @Field()
    @IsNumber()
    serviceLocalId: number/*TopUpAccounts_ServiceLocalIdentifiers*/;
    @Field()
    @IsString()
    currencyType: number/*CurrencyTypes*/;
    @Field({ nullable: true })
    @IsString()
    @IsOptional()
    description?: string;
}

@ObjectType()
export class TopUpAccountOutput implements ITopUpAccountOutput {
    @Field()
    @IsString()
    linkPagePay: string;
    @Field({ nullable: true })
    @IsString()
    linkPagePayWithQRCode?: string;
    @Field()
    @IsString()
    eventId: string;
}

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
export class AmountLimit implements ITopUpAccount.AmountLimit {
    @IsNumber()
    @Field()
    currencyType: number;
    @IsNumber()
    @Field()
    min: number;
    @IsNumber()
    @Field()
    max: number;
}

@ObjectType()
export class CommissionRateLower implements ITopUpAccount.ICommissionRateLower {
    @Field()
    @IsNumber()
    startAmount: number;
    @Field()
    @IsNumber()
    value: number;
}

@ObjectType()
export class CommissionRateLowersInfoForSpecialCurrencyTypesOutput implements ITopUpAccount.ICommissionRateLowersInfoForSpecialCurrencyType {
    @Field()
    @IsNumber()
    currencyType: number;
    @Field(() => [ CommissionRateLower ])
    commissionRateLowersList: CommissionRateLower[];
}

@ObjectType()
export class CommissionRateInfoOutput implements ITopUpAccount.CommissionRateInfo {
    @Field()
    @IsNumber()
    value: number;
    @Field(() => [ CommissionRateLowersInfoForSpecialCurrencyTypesOutput ])
    commissionRateLowersInfoForCurrencyTypesList: CommissionRateLowersInfoForSpecialCurrencyTypesOutput[];
}

@ObjectType()
export class TopUpAccountConfigDTOOutput implements ITopUpModelsOutput.TopUpAccountConfigFrontendDTO {
    @Field(() => [ AmountLimit ])
    amountForCurrenciesLimitsList: AmountLimit[];
    @Field(() => CommissionRateInfoOutput)
    commissionRateInfo: CommissionRateInfoOutput;
}

// Модель данных для события
@ObjectType()
export class TopUpAccountPostbackNotificationEvent implements IPalychPostbackNotificationEvent {
    @Field()
    /** Уникальный идентификатор клиента для фильтрации событий */
    @IsString()
    eventId: string;
    @Field()
    @IsString()
    /** Текст сообщения, которое мы отправим клиенту */
    message: string;
    /** True если событие положительное и undefined или false если не успешное */
    @Field({ nullable: true })
    @IsBoolean()
    isError: boolean;
}
