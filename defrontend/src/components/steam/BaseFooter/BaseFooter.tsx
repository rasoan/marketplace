'use strict';
'use client';

import React from 'react';
import { Flex, Layout } from 'antd';
import Link from 'next/link';
import Logo from '../../Logo/Logo';
import IconFontawesome from "../../ui/IconFontawesome/Icon";
import { theme, themeBase } from '../../../providers/antd/theme';

const {
    Footer,
} = Layout;

import style from "./style.module.scss";

const BaseFooter: React.FC = () => {
    return (
        <Footer className={`${style.Footer}`}>
            <Logo className={`${style.footerContainer__logo}`} />
            <Flex
                className={`${style.Footer__container__rules} ${style.footerContainerRules}`}
            >
                <Link
                    href={`/agreement`}
                    target={"_blank"}
                    style={{ color: theme.token.colorTextSecondary }}
                    className={`${style.footerContainerRules__rulesText} ${style.rulesText}`}
                >
                    Пользовательское соглашение
                </Link>
                <Link
                    href={"/policy"}
                    target={"_blank"}
                    style={{ color: theme.token.colorTextSecondary }}
                    className={`${style.footerContainerRules__rulesText} ${style.rulesText}`}
                >
                    Политика конфиденциальности
                </Link>
            </Flex>
            <Flex
                className={`${style.footerContainer__feedback} ${style.feedback}`}
                justify={"space-between"}
                align={"center"}
                gap={4}
            >
                <IconFontawesome
                    icon={"fa-commenting"}
                    style={{ fontSize: theme.token.fontSizeLG, color: theme.token.colorTextSecondary }}
                />
                <Link
                    href={"https://plati.market/seller/dessly/876867/"}
                    target={"_blank"}
                    style={{ color: theme.token.colorTextSecondary }}
                    className={`${style.feedback__feedbackText} ${style.feedbackText}`}
                >
                    Отзывы
                </Link>
            </Flex>
            <Flex
                className={`${style.footerContainer__socialIconsContainer} ${style.socialIconsContainer}`}
                justify={"space-between"}
            >
                <Link
                    href={"https://t.me/desslyshop"}
                    target={"_blank"}
                    style={{ fontSize: theme.token.fontSizeLG, color: theme.token.colorTextSecondary }}
                    className={`${style.socialIconsContainer__socialIconItem} ${style.socialIconItem}`}
                >
                    <IconFontawesome
                        icon={"fa-telegram"}
                        style={{ fontSize: theme.token.fontSizeLG, color: theme.token.colorTextSecondary }}
                    />
                </Link>
                <Link
                    href={"https://www.instagram.com/desslyshop?igsh=Z3o3c202eHNzMW8z"}
                    target={"_blank"}
                    style={{ fontSize: theme.token.fontSizeLG, color: theme.token.colorTextSecondary }}
                    className={`${style.socialIconsContainer__socialIconItem} ${style.socialIconItem}`}
                >
                    <IconFontawesome
                        icon={"fa-instagram"}
                        style={{ fontSize: theme.token.fontSizeLG, color: theme.token.colorTextSecondary }}
                    />
                </Link>
                <Link
                    href={"https://vk.com/desslyshop"}
                    target={"_blank"}
                    style={{ fontSize: themeBase.token.fontSize20, color: theme.token.colorTextSecondary }}
                    className={`${style.socialIconsContainer__socialIconItem} ${style.socialIconItem}`}
                >
                    <IconFontawesome
                        icon={"fa-vk"}
                        style={{ fontSize: themeBase.token.fontSize20, color: theme.token.colorTextSecondary }}
                    />
                </Link>
            </Flex>
        </Footer>
    );
};

export default BaseFooter;
