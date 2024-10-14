'use strict';

import { ApolloClient, HttpLink, split } from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { apolloClientCache } from './apollo-client-cache';

const backendHostName = process.env.NEXT_PUBLIC_BACKEND_HOST;
const backendApiName = process.env.NEXT_PUBLIC_BACKEND_API_NAME;

if (backendHostName === undefined) {
    throw new TypeError("Cant find backendHostName!");
}

if (backendApiName === undefined) {
    throw new TypeError("Cant find backendApiName!");
}

const apoloClientLink = "".concat(
    backendHostName,
    "/",
    backendApiName,
);

const httpLink = new HttpLink({
    uri: apoloClientLink,
});

const wsLink = new GraphQLWsLink(
    createClient({
        url: apoloClientLink.replace('http', 'ws'),
    }),
);

const splitLink = split(
    ({ query }) => {
        const definition = getMainDefinition(query);

        return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
    },
    wsLink,
    httpLink,
);

const clientSingleton = new ApolloClient({
    link: splitLink,
    cache: apolloClientCache,
});

export default clientSingleton;
