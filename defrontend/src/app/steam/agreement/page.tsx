'use strict';
'use client';

import React from 'react';
import { Layout, Flex } from 'antd';

import BaseHeader from '../../../components/steam/BaseHeader/BaseHeader';
import BaseFooter from '../../../components/steam/BaseFooter/BaseFooter';
import Agreement from "../../../components/Agreement/Agreement";
import style from "./style.module.scss";
import Logo from "../../../components/Logo/Logo";

const PageAgreement: React.FC = () => (
    <Layout>
        <Flex className={`${style.Agreement}`} justify={'space-between'} vertical>
            <Logo isMobile />
            <BaseHeader />
            <Agreement />
            <BaseFooter />
        </Flex>
    </Layout>
);

export default PageAgreement;
