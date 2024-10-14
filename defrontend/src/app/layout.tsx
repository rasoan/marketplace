'use strict';

import React from 'react';
import { Metadata } from 'next';
import Script from 'next/script';

import { Provider } from '../providers/provider';

import "./layout.scss";

export const metadata = {
    title: 'Пополнение баланса кошелька Steam (Стим) с помощью банковской карты онлайн | Dessly',
    description: 'Быстрое и надежное онлайн-пополнение кошелька Steam российской банковской картой. Dessly - это самый выгодный курс и мгновенное пополнение аккаунта в Стим.',
    icons: {
        icon: '/favicon.png',
    },
    other: {
        'apay-tag': 'AE64KNUSOSEG56ZP23GW2ZVE6SLQKGEF',
    },
} satisfies Metadata;

export default function RootLayout({ children }: {
  children: React.ReactNode
}) {
    return (
        <html lang="en">
            <head>
                <Script src="//code.jivo.ru/widget/rZ1InH2VVX" async />
            </head>
            <body>
                <Provider>
                    {children}
                </Provider>
            </body>
        </html>
    );
}
