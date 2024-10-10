'use strict';

import { ApolloDriver } from "@nestjs/apollo";
import { GraphQLModule } from "@nestjs/graphql";
import { ConfigModule } from "@nestjs/config";
import { Module } from "@nestjs/common";
import { join } from "path";

import { UserModule } from "./user/user.module";
import { TopUpAccountModule } from "./topUpAccount/topUpAccount.module";
import { TopUpAccountConfigModule } from "./topUpAccountConfig/topUpAccountConfig.module";
import { EventEmitterWrapperModule } from "./eventEmitterWrapper/eventEmitterWrapper.module";
import { ExchangeRateModule } from "./exchangeRate/exchangeRate.module";
import { PayGatewayWrapperModule } from "./payGatewayWrapper/payGatewayWrapper.module";

const nodeEnv = process.env.NODE_ENV;

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        GraphQLModule.forRoot({
            driver: ApolloDriver,
            installSubscriptionHandlers: true,
            autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
            subscriptions: {
                'graphql-ws': {
                    path: '/graphql',
                },
                'subscriptions-transport-ws': {
                    path: '/graphql',
                },
            },
            playground: nodeEnv === 'dev',
        }),
        UserModule,
        TopUpAccountModule,
        TopUpAccountConfigModule,
        ExchangeRateModule,
        EventEmitterWrapperModule,
        PayGatewayWrapperModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
