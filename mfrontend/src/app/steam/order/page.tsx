'use client';
'use strict';

import React, { useEffect } from 'react';
import { Button, Flex, Typography } from 'antd';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const {  Link } = Typography;

import { orderPayVar } from '../../../graphql/apollo-client-cache';
import { Pages } from '../../constants';
import paypalychImgSrc from "../../../../public/images/paypalych.png";
import { theme } from '../../../providers/antd/theme';

import styles from "./style.module.scss";

const Order: React.FC = () => {
    const router = useRouter();
    const orderPay = orderPayVar();

    useEffect(() => {
        if (!orderPay) {
            router.push(Pages.Main);
        }
    }, [ orderPay, router ]);

    if (!orderPay) {
        return null;
    }

    const {
        linkToPagePay,
        linkToPagePayWithQRCode,
    } = orderPay;

    const redirectToFormPay = () => {
        orderPayVar(null);

        router.push(Pages.Main);
    };

    return <Flex
        className={`${styles.Order}`}
        align={'center'}
        justify={"center"}
        gap="small"
        vertical
    >
        <Image
            className={`${styles.Order__paypalychLogo} ${styles.orderPaypalychLogo}`}
            priority={true}
            width={300}
            height={400}
            src={paypalychImgSrc}
            alt={'paypalych logo'}
        />
        <Link
            className={`${styles.Order__linkToPagePay} ${styles.linkToPagePay} ${styles.textModifier}`}
            style={{ fontSize: theme.token?.fontSizeLG }}
            href={`${linkToPagePay}`}
            target="_blank"
            rel="ссылка на страницу оплаты"
        >
            Ссылка на страницу оплаты
        </Link>
        <Link
            className={`${styles.Order__linkToPagePay} ${styles.linkToPagePay} ${styles.textModifier}`}
            style={{ fontSize: theme.token.fontSizeLG }}
            href={`${linkToPagePayWithQRCode}`}
            target="_blank"
            rel="ссылка на страницу оплаты с QR кодом"
        >
            Ссылка на страницу оплаты с QR кодом
        </Link>
        <Button
            className={`${styles.Order__buttonReturnToPay} ${styles.buttonReturnToPay} ${styles.textModifier}`}
            style={{ fontSize: theme.token.fontSizeLG }}
            onClick={redirectToFormPay}
        >
            Вернуться к форме оплаты
        </Button>
    </Flex>;
};

export default Order;
