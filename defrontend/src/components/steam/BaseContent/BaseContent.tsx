'use strict';
'use client';

import React from 'react';
import { Layout } from 'antd';

import PayForm from '../../PayForm/PayForm';
import Robot from '../../ui/Robot/Robot';

import style from "./style.module.scss";
import SteamStats from "../SteamStats/SteamStats";

const {
    Content,
} = Layout;

const PageSteam: React.FC = () => {
    return (
        <Content className={`${style.Content}`}>
            <div className={style.SteamSquareOne}></div>
            <div className={style.SteamSquareTwo}></div>
            <div className={style.SteamSquareThree}></div>
            <div className={style.SteamSquareFour}></div>
            <Robot />
            <SteamStats/>
            <PayForm/>
        </Content>
    );
};

export default PageSteam;
