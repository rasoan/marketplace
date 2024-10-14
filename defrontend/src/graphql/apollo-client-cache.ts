import { InMemoryCache } from '@apollo/client';

interface OrderPay {
  linkToPagePay: string;
  linkToPagePayWithQRCode?: string | null;
}

export const apolloClientCache = new InMemoryCache({
    typePolicies: {
        Query: {
            fields: {
                order: {
                    read(): OrderPay | null {
                        return orderPayVar();
                    },
                },
                payNotificationEventId: {
                    read(): string | null {
                        return payNotificationEventIdVar();
                    },
                },
            },
        },
    },
});

export const orderPayVar = apolloClientCache.makeVar<
  OrderPay | null
>(null);
export const payNotificationEventIdVar = apolloClientCache.makeVar<
  string | null
>(null);
