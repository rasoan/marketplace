'use strict';
'use client';

import React from 'react';
import { Flex } from 'antd';
import Image from 'next/image';
import Link from 'next/link';
import LogoImage from '../../../public/images/logo.svg';

import style from "./style.module.scss";

type LogoType = {
    isMobile?: boolean,
    className?: string
};

const Logo: React.FC<LogoType> = ({ isMobile, className }) => {
    return (
        <Flex
            className={`${style.Logo} ${isMobile ? style.isMobile : style.isDesktop} ${className}`}
            align={"center"}
        >
            <Link href={"/"}>
                <Image
                    className={`${style.Logo__icon} ${style.LogoIcon}`}
                    width={135}
                    height={23}
                    src={LogoImage}
                    alt={"Dessly logo"}
                />
            </Link>
        </Flex>
    );
};

export default Logo;
