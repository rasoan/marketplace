'use strict';
'use client';

import React from 'react';
import { Button, Dropdown, Flex, Layout, Space, Typography } from 'antd';

const {
    Text,
} = Typography;

const {
    Header,
} = Layout;

import style from "./style.module.scss";
import Logo from '../../Logo/Logo';
import { theme, themeBase } from '../../../providers/antd/theme';
import iconWallet from "../../../../public/images/icon-wallet.svg";
import Image from "next/image";
import IconFontawesome from "../../ui/IconFontawesome/Icon";

const menuProps = {
    items: [
        { key: '1', label: 'Введите свой логин аккаунта.' },
        { key: '2', label: 'Введите сумму, на которую хотите пополнить баланс Steam.' },
        { key: '3', label: 'Проверьте, что указали именно логин, а не никнейм.' },
        { key: '4', label: 'Нажмите кнопку «Пополнить».' },
        { key: '5', label: 'Вы перейдете на страницу, где необходимо выбрать метод оплаты.' },
        { key: '6', label: 'После успешной оплаты деньги поступят на баланс аккаунта в течение 2-15 минут. При возникновении вопросов свяжитесь с поддержкой.' },
    ],
    onClick: () => void 0,
};

const BaseHeader: React.FC = () => {
    return (
        <Header
            className={`${style.Header}`}
        >
            <Flex
                className={`${style.Header__container} ${style.headerContainer}`}
                justify={"space-between"}
                align={"center"}
            >
                <Flex
                    className={`${style.headerContainer__textContainer} ${style.textContainer}`}
                    justify={"space-between"}
                    align={"center"}
                    gap={"8px"}
                >
                    <Image
                        className={`${style.Logo__icon} ${style.LogoIcon}`}
                        width={20}
                        height={20}
                        src={iconWallet}
                        alt={"Dessly logo"}
                    />
                    <Text
                        className={`${style.textContainer__text} ${style.textContainerText}`}
                    >
                        Пополнить Steam
                    </Text>
                </Flex>
                <Logo />
                <Flex
                    className={`${style.headerContainer__textContainer} ${style.textContainer_question} ${style.textContainerQuestion}`}
                    justify={"space-between"}
                    align={"center"}
                >
                    <Dropdown
                        className={`${style.textContainerQuestion__dropdown}`}
                        menu={menuProps}
                        dropdownRender={() => (
                            <div className={`${style.textContainerQuestion__dropdownItems}`} style={{ backgroundColor: themeBase.token.bgColorSecondary }}>
                                {menuProps.items.map(({ key, label }) => (
                                    <div className={`${style.textContainerQuestion__dropdownItem}`} key={key}>
                                        <span className={`${style.textContainerQuestion__dropdownItemsKey}`}>{key}.</span>
                                        {label}
                                    </div>
                                ))}
                            </div>
                        )}
                    >
                        <Flex>
                            <Button
                                className={`${style.textContainerQuestion__button} ${style.textContainerQuestionButton}`}
                            >
                                <Space>
                                    <Flex
                                        align={"center"}
                                        justify={"center"}
                                        className={`${style.textContainerQuestion__buttonIconQues} ${style.textContainerQuestionIcon}`}
                                    >
                                        <IconFontawesome icon={"fa-question"} className={`${style.iconQues}`}/>
                                    </Flex>
                                    <Text
                                        style={{ color: theme.token.colorText }}
                                        className={`${style.textContainerQuestion__text} ${style.textContainerQuestionText}`}
                                    >
                                        Как пополнить
                                    </Text>
                                    <IconFontawesome icon={"fa-angle-down"} className={`${style.iconArrow}`} style={{ fontSize: theme.token.fontSizeXL }}/>
                                </Space>
                            </Button>
                            <Button
                                className={`${style.textContainerQuestion__buttonMobile} ${style.textContainerQuestionButtonMobile}`}
                            >
                                <Flex
                                    align={"center"}
                                    justify={"center"}
                                    className={`${style.textContainerQuestion__buttonIconQues} ${style.textContainerQuestionIcon}`}
                                >
                                    <IconFontawesome icon={"fa-bars"} className={`${style.iconArrow} ${style.iconDefault}`} style={{ fontSize: theme.token.fontSizeXL }}/>
                                    <IconFontawesome icon={"fa-times"} className={`${style.iconArrow} ${style.iconHover}`} style={{ fontSize: theme.token.fontSizeXL }}/>
                                </Flex>
                            </Button>
                        </Flex>
                    </Dropdown>
                </Flex>
            </Flex>
        </Header>
    );
};

export default BaseHeader;
