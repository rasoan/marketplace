'use strict';
'use client';

import React, { ReactNode } from 'react';
import { ConfigProvider } from 'antd';

import { theme } from './theme';

export const AntdProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    return (<ConfigProvider theme={theme}>
        {children}
    </ConfigProvider>
    );
};
