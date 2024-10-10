'use strict';
'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useApolloClient } from '@apollo/client';

import { TopUpAccountPostbackNotificationEventDocument, TopUpAccountPostbackNotificationEvent } from '../../graphql/generated/types';
import { useNotification } from '../notification/notificationProvider';

interface SubscriberContextProps {
    subscribeToGlobalEvent: (eventId: string) => void;
    unsubscribeFromGlobalEvent: (eventId: string) => void;
}

const subscriberContext = createContext<SubscriberContextProps | undefined>(undefined);

export const SubscriberProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { openNotification } = useNotification();
    const client = useApolloClient();
    const subscriptions = new Map<string, () => void>();

    const unsubscribeFromGlobalEvent = (eventId: string) => {
        const unsubscribe = subscriptions.get(eventId);

        if (unsubscribe) {
            unsubscribe();
            subscriptions.delete(eventId);
        }
    };

    const subscribeToGlobalEvent = (eventId: string) => {
        if (subscriptions.has(eventId)) {
            unsubscribeFromGlobalEvent(eventId);
        }

        const observable = client.subscribe({
            query: TopUpAccountPostbackNotificationEventDocument,
            variables: { eventId },
        });

        const subscription = observable.subscribe({
            next: (result: { data: { topUpAccountPostbackNotificationEvent: TopUpAccountPostbackNotificationEvent } }) => {
                const { message, isError } = result.data.topUpAccountPostbackNotificationEvent;

                openNotification(message, isError ? 'error' : 'success');
            },
            error: (err) => {
                console.error('Ошибка подписки:', err);
            },
        });

        subscriptions.set(eventId, () => subscription.unsubscribe());
    };

    return (
        <subscriberContext.Provider
            value={{ subscribeToGlobalEvent, unsubscribeFromGlobalEvent }}
        >
            {children}
        </subscriberContext.Provider>
    );
};

export const useSubscriber = (): SubscriberContextProps => {
    const context = useContext(subscriberContext);

    if (!context) {
        throw new Error('useSubscriber must be used within a SubscriberProvider');
    }

    return context;
};
