'use strict';
'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { notification } from 'antd';
import { assertIsDefined } from '@detools/type_guards/base';

type OpenNotificationCallback = (message: string, type: "success" | "error" | "warning" | "info") => void;

interface NotificationContextProps {
  openNotification: OpenNotificationCallback;
}

const notificationContext = createContext<NotificationContextProps | undefined>(void 0);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [ api, contextHolder ] = notification.useNotification();

    const openNotification: OpenNotificationCallback = (message, type) => {
        api.open({
            message: message,
            key: `open${Date.now()}`,
            type,
            duration: 6,
        });
    };

    return (
        <notificationContext.Provider value={{ openNotification }}>
            {contextHolder}
            {children}
        </notificationContext.Provider>
    );
};

export const useNotification = (): NotificationContextProps => {
    const context = useContext(notificationContext);

    assertIsDefined(context, 'useNotification must be used within a NotificationProvider');

    return context;
};
