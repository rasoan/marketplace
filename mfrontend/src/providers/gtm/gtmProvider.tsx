'use strict';
'use client';

import React, { ReactNode, useEffect } from 'react';

import { insertGTMIntoHTML } from './gtm';

const GtmProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    useEffect(() => {
        insertGTMIntoHTML();
    }, []);

    return (
        <>
            {children}
        </>
    );
};

export default GtmProvider;
