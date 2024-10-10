'use strict';
'use client';

import React from 'react';
import { Layout, Flex } from 'antd';

import BaseHeader from '../../../components/steam/BaseHeader/BaseHeader';
import BaseFooter from '../../../components/steam/BaseFooter/BaseFooter';
import Policy from '../../../components/Policy/Policy';
import style from './policy.module.scss';
import Logo from "../../../components/Logo/Logo";

const PageAgreement: React.FC = () => (
    <Layout>
        <Flex className={`${style.Policy}`} justify={'space-between'} vertical>
            <Logo isMobile />
            <BaseHeader />
            <Policy />
            <BaseFooter />
        </Flex>
    </Layout>
);

export default PageAgreement;
