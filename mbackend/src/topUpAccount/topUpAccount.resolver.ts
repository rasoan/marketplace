'use strict';

import { Args, Mutation, Resolver, Subscription } from '@nestjs/graphql';
import { Inject } from '@nestjs/common';
import { PubSub } from "graphql-subscriptions";

import {
    TopUpAccountInput,
    TopUpAccountOutput,
    TopUpAccountPostbackNotificationEvent,
} from "./models/TopUpAccount.model";
import { TopUpAccountService } from "./topUpAccount.service";
import { IPalychPostbackNotificationEvent } from "./types/topUpAccount";

const pubSub = new PubSub();

export const topUpAccountPostbackNotificationEventType = 'postbackNotificationEvent';

@Resolver(() => TopUpAccountInput)
export class TopUpAccountResolver {
    @Inject(TopUpAccountService)
    private readonly topUpAccountService: TopUpAccountService;

    @Mutation(() => TopUpAccountOutput)
    public async topUpAccount(@Args('input') accountTopUpInput: TopUpAccountInput): Promise<TopUpAccountOutput> {
        return this.topUpAccountService.topUpAccount(accountTopUpInput);
    }

    // todo: скорее всего это можно сделать одним универсальным событием, payload.topUpAccountPostbackNotificationEvent.eventId
    //  он меня почему-то заставляет использовать именно такую структуру, здесь topUpAccountPostbackNotificationEvent
    //  слишком длинное название, но по другому назвать не получается иначе ивент мимо пролетает, пока не разобрался точно что от чего здесь зависит,
    //  с появлением других типов событий может лучше будет их как-то сгруппировать здесь ну и topUpAccountPostbackNotificationEvent переименовать
    //  на какое-то другое название, более универсальное
    // eslint-disable-next-line class-methods-use-this
    @Subscription(() => TopUpAccountPostbackNotificationEvent, {
        filter: (payload, variables) => payload.topUpAccountPostbackNotificationEvent.eventId === variables.eventId,
    })
    topUpAccountPostbackNotificationEvent(@Args('eventId') eventId: string) {
        return pubSub.asyncIterator(topUpAccountPostbackNotificationEventType);
    }
}

export function topUpsEmitPalychPostbackNotificationEvent(event: IPalychPostbackNotificationEvent) {
    pubSub.publish(topUpAccountPostbackNotificationEventType, { topUpAccountPostbackNotificationEvent: event });
}
