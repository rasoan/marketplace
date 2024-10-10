'use strict';
'use client';

import React, { ReactNode } from 'react';

import { NotificationProvider } from './notification/notificationProvider';
import { SubscriberProvider } from './subsciber/subscriberProvider';
import { AntdProvider } from './antd/antdProvider';
import { ApolloBaseProvider } from './apollo/apolloBaseProvider';
import GtmProvider from './gtm/gtmProvider';

export const Provider: React.FC<{ children: ReactNode }> = ({ children }) => {
    return (
        <GtmProvider>
            <AntdProvider>
                <NotificationProvider>
                    <ApolloBaseProvider>
                        <SubscriberProvider>
                            {children}
                        </SubscriberProvider>
                    </ApolloBaseProvider>
                </NotificationProvider>
            </AntdProvider>
        </GtmProvider>
    );
};
