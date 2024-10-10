'use strict';
'use client';

import React from 'react';
import { Flex, Layout } from 'antd';

import BaseHeader from '../../components/steam/BaseHeader/BaseHeader';
import BaseContent from '../../components/steam/BaseContent/BaseContent';
import BaseFooter from '../../components/steam/BaseFooter/BaseFooter';

import style from "./style.module.scss";
import Logo from "../../components/Logo/Logo";
import { theme } from "../../providers/antd/theme";

const PageSteam: React.FC = () => (
    <Flex
        className={`${style.pageSteam}`}
        gap="middle"
        wrap={true}
        style={{ background: theme.token.colorBgBase }}
    >
        <Layout className={`${style.steamLayout}`}>
            <Flex justify="center">
                <Logo isMobile />
            </Flex>
            <BaseHeader />
            <BaseContent />
            <BaseFooter />
        </Layout>
    </Flex>
);

export default PageSteam;
