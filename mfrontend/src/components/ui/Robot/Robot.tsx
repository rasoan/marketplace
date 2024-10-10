'use strict';
'use client';

import React, { useState } from 'react';
import style from "./style.module.scss";
import { themeBase } from '../../../providers/antd/theme';
import {assertIsDefined} from "@detools/type_guards/base";

const Robot: React.FC = () => {
    const arrayMessages: string[] = [
        'Слева от меня ты можешь пополнить свой Steam кошелек 🤩',
    ];

    const [ message, setMessage ] = useState<string | null>(null);

    const handleClick = () => {
        assertIsDefined(arrayMessages[0], 'Нет сообщений');
        setMessage(arrayMessages[0]);
    };

    return (
        <div className={style.SteamRobot}>
            <div className={style.SteamRobotMessage}>
                <div className={style.SteamRobotMessageItem} style={{ backgroundColor: themeBase.token.bgColorFirstly }}>Привет, нажми на меня</div>
                {message && (
                    <div className={style.SteamRobotMessageItem} style={{ backgroundColor: themeBase.token.bgColorFirstly }}>{message}</div>
                )}
            </div>
            <div className={style.SteamRobotModel} onClick={handleClick} />
        </div>
    );
};

export default Robot;
