'use strict';
'use client';

import React, { useEffect } from 'react';

const Page: React.FC = () => {
    useEffect(() => {
        // todo: временная заглушка, когда здесь появится вёрстка - убрать
        window.location.href = 'http://steam.dessly.net';
    }, []);

    return (
        <div>
            Главная dessly.net
        </div>
    );
};

export default Page;
