'use strict';
'use client';

import React from 'react';
import { Flex } from 'antd';
import style from "./style.module.scss";

const SteamStats: React.FC = () => {
    return (
        <Flex
            vertical={true}
            gap={24}
            className={`${style.SteamStats}`}
        >
            <div className={style.SteamStats__item}>
                <div className={style.SteamStats__itemNum}>10%</div>
                <div className={style.SteamStats__itemDesc}>Самая низкая<br /> комиссия на рынке</div>
            </div>
            <div className={style.SteamStats__item}>
                <div className={style.SteamStats__itemNum}>350к</div>
                <div className={style.SteamStats__itemDesc}>Пополнений</div>
            </div>
        </Flex>
    );
};

export default SteamStats;
