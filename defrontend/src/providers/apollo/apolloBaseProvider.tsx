'use strict';
'use client';

import React, { ReactNode } from 'react';
import { ApolloProvider } from '@apollo/client';

import client from '../../graphql/apollo-client';

export const ApolloBaseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    return (
        <ApolloProvider client={client}>
            {children}
        </ApolloProvider>
    );
};
