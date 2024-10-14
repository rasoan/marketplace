'use strict';
'use client';

import type { PayFormProps } from './PayForm.types';

import { useRouter } from 'next/navigation';
import React, { FC, useEffect, useState } from 'react';

import { Button, Input, InputNumber, Typography, Checkbox, Modal, Flex, Spin, Tooltip } from 'antd';
import Image from "next/image";

const { Title, Text, Link } = Typography;

import { assertIsDefined, isNumberType } from '@detools/type_guards/base';
import { useNotification } from '../../providers/notification/notificationProvider';
import { CurrencyType, CurrencyIcon, CurrencyData } from '../../utils/constants';
import  { TopUpAccounts_ServiceLocalIdentifiers } from '../../utils/topUpAccount/constants';

import {
    GetUsersListDocument,
    useGetTopUpAccountConfigQuery,
    useTopUpAccountMutation,
    AmountLimit,
    CommissionRateLowersInfoForSpecialCurrencyTypesOutput, useGetExchangeRateQuery,
} from '../../graphql/generated/types';

import {
    getAmountWithOurCommissionInRub,
    getLabelByServiceId,
    normalizeNumberFloat,
} from '../../utils/topUpAccount/topUpAccount';

import { orderPayVar, payNotificationEventIdVar } from '../../graphql/apollo-client-cache';
import { useSubscriber } from '../../providers/subsciber/subscriberProvider';

import styles from './style.module.scss';
import { theme, themeBase } from '../../providers/antd/theme';

import iconVisa from "../../../public/images/visa-logo.svg";
import iconMastercard from "../../../public/images/mastercard-logo.svg";
import iconMir from "../../../public/images/mir-logo.svg";
import flagModalRu from "../../../public/images/modal-flags/flag-ru.svg";
import flagModalKz from "../../../public/images/modal-flags/flag-kz.svg";
import flagModalBy from "../../../public/images/modal-flags/flag-by.svg";
import flagModalAm from "../../../public/images/modal-flags/flag-am.svg";
import flagModalGe from "../../../public/images/modal-flags/flag-ge.svg";
import flagModalKy from "../../../public/images/modal-flags/flag-ky.svg";
import flagModalUz from "../../../public/images/modal-flags/flag-uz.svg";
import flagModalAz from "../../../public/images/modal-flags/flag-az.svg";
import flagModalTj from "../../../public/images/modal-flags/flag-tj.svg";

import IconFontawesome from "../ui/IconFontawesome/Icon";
import modalImg from "../../../public/images/img-modal.png";
import ModalWrapper from "../ui/ModalWrapper/ModalWrapper";
import { CloseOutlined, LoadingOutlined } from "@ant-design/icons";
import { validateEmail } from "@detools/helpers/helpers";
import { TopUpAccountConfigWrapperFrontend } from '../../utils/TopUpAccountConfigWrapperFrontend/TopUpAccountConfigWrapperFrontend';
import { ExchangeRateWrapper } from '../../utils/ExchangeRateWrapper/ExchangeRateWrapper';

const PayForm: FC<PayFormProps> = () => {
    const { openNotification } = useNotification();
    const { subscribeToGlobalEvent } = useSubscriber();
    const router = useRouter();
    const payNotificationEventId = payNotificationEventIdVar();

    const [ amountToOur, setAmountToOur ] = useState<boolean>(false);
    const [ amountToClient, setAmountToClient ] = useState<number>();
    const [ activeCurrency, setActiveCurrency ] = useState<CurrencyType>(CurrencyType.Rub);
    const [ description ] = useState("");
    const [ email, setEmail ] = useState("");
    const [ emailError, setEmailError ] = useState<string | null>(null);
    const [ account, setAccount ] = useState("");
    const [ promoCode, setPromoCode ] = useState<string>("");
    const [ isPromoActive, setIsPromoActive ] = useState<boolean>(false);
    const [ isEmailActive, setIsEmailActive ] = useState(false);
    const [ openModal, setOpenModal ] = useState(false);
    const [ openModalCountries, setOpenModalCountries ] = useState(false);
    const [ topUpAccountConfig, setTopUpAccountConfig ] = useState<TopUpAccountConfigWrapperFrontend | null>(null);
    const [ exchangeRateWrapper, setExchangeRateWrapper ] = useState<ExchangeRateWrapper | null>(null);
    const [ amountForCurrenciesLimitByCurrencyTypeForce, setAmountForCurrenciesLimitByCurrencyTypeForce ] = useState<AmountLimit | null>(null);
    const [ commissionRateLowersByCurrencyTypeForce, setCommissionRateLowersByCurrencyTypeForce ] = useState<CommissionRateLowersInfoForSpecialCurrencyTypesOutput | null>(null);
    const [ currencyIcon, setCurrencyIcon ] = useState<string>("");

    const showModal = () => {
        setOpenModal(true);
    };
    const hideModal = () => {
        setOpenModal(false);
    };

    const showModalCountries = () => {
        setOpenModalCountries(true);
    };
    const hideModalCountries = () => {
        setOpenModalCountries(false);
    };

    const {
        data: {
            getTopUpAccountConfig: topUpAccountConfigDTO,
        } = {},
        loading,
    } = useGetTopUpAccountConfigQuery();

    const {
        data: {
            getExchangeRates: exchangeRatesDTO,
        } = {},
        loading: exchangeRatesDTO_loading,
    } = useGetExchangeRateQuery();

    useEffect(() => {
        if (topUpAccountConfigDTO) {
            const config = TopUpAccountConfigWrapperFrontend.fromDTO(topUpAccountConfigDTO);

            if (exchangeRatesDTO) {
                const exchangeRatesWrapper = new ExchangeRateWrapper(exchangeRatesDTO);

                setExchangeRateWrapper(exchangeRatesWrapper);
            }

            setTopUpAccountConfig(config);

            const amountLimit = config.getAmountForCurrenciesLimitByCurrencyTypeForce(activeCurrency);
            const commissionRateLowers = config.getCommissionRateLowersByCurrencyTypeForce(activeCurrency);

            assertIsDefined(amountLimit, "No limit min/max for currency");

            setAmountForCurrenciesLimitByCurrencyTypeForce(amountLimit);
            setCommissionRateLowersByCurrencyTypeForce(commissionRateLowers);
            setCurrencyIcon(CurrencyIcon[activeCurrency]);
        }
    }, [ topUpAccountConfigDTO, activeCurrency, amountForCurrenciesLimitByCurrencyTypeForce, currencyIcon, exchangeRatesDTO ]);

    const [ topUpAccountRequest ] = useTopUpAccountMutation({
        variables: {
            amount: amountToClient as number,
            description,
            account,
            email,
            currencyType: activeCurrency,
            serviceLocalId: TopUpAccounts_ServiceLocalIdentifiers.Steam,
        },
        refetchQueries: [ { query: GetUsersListDocument } ],
    });

    const handleTopUp = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (emailError || !email) {
            openNotification('Введите корректный email', 'error');

            return;
        }

        try {
            const result = await topUpAccountRequest();

            assertIsDefined(result.data, "No result of create bill!");

            orderPayVar({
                linkToPagePay: result.data.topUpAccount.linkPagePay,
                linkToPagePayWithQRCode: result.data.topUpAccount.linkPagePayWithQRCode,
            });

            payNotificationEventIdVar(result.data.topUpAccount.eventId);
            router.push(result.data.topUpAccount.linkPagePay);
        }
        catch (error) {
            openNotification(
                `Не удалось пополнить аккаунт ${account} в ${getLabelByServiceId({
                    serviceLocalId: TopUpAccounts_ServiceLocalIdentifiers.Steam,
                })}`,
                'error'
            );
        }
    };

    useEffect(() => {
        if (email && validateEmail(email)) {
            setIsEmailActive(true);
        }
    }, [ email ]);

    const handleEmailChange = (value: string) => {
        setEmail(value);

        if (validateEmail(value)) {
            setIsEmailActive(true);
        }
        else {
            setIsEmailActive(false);
        }
    };

    useEffect(() => {
        if (amountToClient) {
            setAmountToOur(true);
        }
    }, [ amountToClient ]);

    useEffect(() => {
        if (payNotificationEventId) {
            subscribeToGlobalEvent(payNotificationEventId);
        }
    }, [ payNotificationEventId, subscribeToGlobalEvent ]);

    const onChangeAmount = (amountToClient: number | null) => {
        if (!isNumberType(amountToClient)) {
            setAmountToClient(0);
            setAmountToOur(false);

            return;
        }

        setAmountToClient(normalizeNumberFloat(amountToClient));
    };

    const onChangeCurrency = (currencyType: CurrencyType) => {
        setActiveCurrency(currencyType);
        setAmountToClient(0);
    };

    const onChangePromo = (event: { target: { checked: boolean }}) => {
        setIsPromoActive(event.target.checked);
    };

    const calculateProgressWidth = (amountToClient: number | undefined) => {
        const commissionRates = commissionRateLowersByCurrencyTypeForce?.commissionRateLowersList;

        if (!commissionRates || commissionRates.length === 0 || amountToClient === undefined) {
            return '0%';
        }

        const LAST_ELEMENT = -1;
        const minAmount = amountForCurrenciesLimitByCurrencyTypeForce?.min ?? commissionRates[0].startAmount;
        const maxAmount = amountForCurrenciesLimitByCurrencyTypeForce?.max ?? commissionRates.at(LAST_ELEMENT)?.startAmount;

        if (amountToClient < minAmount) {
            return '0%';
        }

        if (maxAmount && amountToClient >= maxAmount) {
            return '100%';
        }

        const TOTAL_PERCENT = 100;
        const STATIC_ELEMENTS = 2;
        const stepPercent = TOTAL_PERCENT / (commissionRates.length + STATIC_ELEMENTS);
        let result = 0;

        if (amountToClient >= minAmount && amountToClient < commissionRates[0].startAmount) {
            const rangePercent = (amountToClient - minAmount) / (commissionRates[0].startAmount - minAmount);

            result = rangePercent * stepPercent;

            return `${result}%`;
        }

        for (const [ i, currentRate ] of commissionRates.entries()) {
            const rangeStart = currentRate.startAmount;
            const rangeEnd = commissionRates[i + 1]?.startAmount ?? maxAmount;

            if (rangeEnd !== undefined && amountToClient >= rangeStart && amountToClient < rangeEnd) {
                const rangePercent = (amountToClient - rangeStart) / (rangeEnd - rangeStart);

                result = (i + 1) * stepPercent + rangePercent * stepPercent;

                return `${result}%`;
            }
        }

        return `${result}%`;
    };

    if (!exchangeRateWrapper) {
        return null;
    }

    return (
        <>
            <form
                style={{ backgroundColor: themeBase.token.bgColorSecondary }}
                className={`${styles.PayForm}`}
                onSubmit={handleTopUp}
            >
                <Spin spinning={loading && exchangeRatesDTO_loading} indicator={<LoadingOutlined style={{ color: themeBase.token.borderFieldColor }} />} size="large">
                    <Flex vertical gap={16}>
                        <Text className={`${styles.PayForm__commission}`}>
                            Комиссия от <span>10%</span>
                        </Text>
                        <div className={styles.PayForm__InputWrap}>
                            <Input
                                className={`${styles.PayForm__field} ${styles.field} ${account ? 'active' : ''}`}
                                value={account}
                                required
                                onChange={({ target: { value } }) => {
                                    setAccount(value);
                                }}
                                addonAfter="Введите логин Steam"
                            />
                            <Link
                                className={`${styles.iconQuesWrap}`}
                                onClick={showModal}
                            >
                                <IconFontawesome icon={"fa-question"} className={`${styles.iconQues}`}/>
                            </Link>
                        </div>
                        <div className={styles.PayForm__InputWrap}>
                            <Input
                                className={`${styles.PayForm__field} ${styles.field} ${email ? 'active' : ''} ${emailError ? styles.field__error : ''}`}
                                value={email}
                                required
                                onChange={({ target: { value } }) => handleEmailChange(value)}
                                onBlur={() => {
                                    validateEmail(email) ? setEmailError(null) : setEmailError('Неверный формат email');
                                }}
                                addonAfter="Email, на который отправим чек "
                            />
                        </div>
                        {emailError && <Text type="danger" className={styles.errorText}>{emailError}</Text>}
                        <div className={`${styles.PayForm__InputWrap}`}>
                            <InputNumber
                                className={`${styles.PayForm__field} ${styles.field} ${amountToClient ? 'active' : ''}`}
                                placeholder="Введите сумму"
                                value={amountToClient}
                                min={amountForCurrenciesLimitByCurrencyTypeForce?.min}
                                max={amountForCurrenciesLimitByCurrencyTypeForce?.max}
                                required
                                controls={false}
                                onChange={onChangeAmount}
                                addonAfter="Введите сумму"
                            />
                            <div className={styles.PayForm__currencyItems}>
                                {CurrencyData
                                    .sort((a, b) => {
                                        const order = [ CurrencyType.Rub, CurrencyType.Kzt, CurrencyType.Uah, CurrencyType.Usd ];

                                        return order.indexOf(a.type) - order.indexOf(b.type);
                                    })
                                    .map((currency) => (
                                        <div
                                            key={currency.type}
                                            className={`${styles.PayForm__currencyItem} ${
                                                activeCurrency === currency.type ? styles.PayForm__currencyItemActive : ''
                                            }`}
                                            onClick={() => onChangeCurrency(currency.type)}
                                        >
                                            <Image width={20} height={20} src={currency.flag} alt={currency.alt}/>
                                            <span>{currency.code}</span>
                                        </div>
                                    ))
                                }
                            </div>
                            <Link
                                className={`${styles.iconQuesWrap} ${styles.iconQuesCurrency}`}
                                onClick={showModalCountries}
                            >
                                <IconFontawesome icon={"fa-question"} className={`${styles.iconQues}`}/>
                            </Link>
                        </div>
                        <div className={styles.saleCommission}>
                            <div className={styles.saleCommission__title}>Снижение комиссии</div>
                            <div className={styles.saleCommission__line}>
                                <div className={styles.saleCommission__percentsItems}>
                                    <div
                                        className={`${styles.saleCommission__percentsItem}`}
                                    >
                                        <Text>-0%</Text>
                                    </div>
                                    {commissionRateLowersByCurrencyTypeForce?.commissionRateLowersList.map((commissionRate, index) => (
                                        <div
                                            key={index}
                                            className={`${styles.saleCommission__percentsItem} ${
                                                (index === commissionRateLowersByCurrencyTypeForce?.commissionRateLowersList.length - 1)
                                                    ? styles.saleCommission__percentsItemPopular
                                                    : ''
                                            }`}
                                        >
                                            <Text>-{commissionRate.value}%</Text>
                                        </div>
                                    ))}

                                    <div className={`${styles.saleCommission__percentsItem}`}></div>
                                </div>
                                <div
                                    className={styles.saleCommission__lineProgress}
                                    style={{ width: calculateProgressWidth(amountToClient) }}
                                ></div>
                                <div className={styles.saleCommission__priceItems}>
                                    <div className={styles.saleCommission__priceItem}>
                                        <Text>{amountForCurrenciesLimitByCurrencyTypeForce?.min}{currencyIcon}</Text>
                                    </div>
                                    {commissionRateLowersByCurrencyTypeForce?.commissionRateLowersList.map((commissionRate, index) => (
                                        <div key={index} className={styles.saleCommission__priceItem}>
                                            <Text>{commissionRate.startAmount}{currencyIcon}</Text>
                                        </div>
                                    ))}
                                    <div className={`${styles.saleCommission__priceItem} ${styles.saleCommission__priceItemLast}`}>
                                        <Text>{amountForCurrenciesLimitByCurrencyTypeForce?.max}{currencyIcon}</Text>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Checkbox onChange={onChangePromo}>У меня есть промокод</Checkbox>
                        {isPromoActive && (
                            <Input
                                className={`${styles.PayForm__field} ${styles.field} ${promoCode.length > 0 ? 'active' : ''}`}
                                value={promoCode}
                                onChange={({ target: { value } }) => setPromoCode(value)}
                                addonAfter="Введите промокод"
                            />
                        )}
                        <div className={styles.payMethods}>
                            <div className={styles.payMethods__item}>
                                <Image
                                    src={iconVisa}
                                    alt={"visa logo"}
                                />
                            </div>
                            <div className={styles.payMethods__item}>
                                <Image
                                    src={iconMastercard}
                                    alt={"mastercard logo"}
                                />
                            </div>
                            <div className={styles.payMethods__item}>
                                <Image
                                    src={iconMir}
                                    alt={"mir logo"}
                                />
                            </div>
                        </div>
                        <Tooltip title={!account || !email || !amountToClient ? 'Пожалуйста, заполните все поля' : ''}>
                            <Button
                                type="primary"
                                htmlType="submit"
                                className={`${styles.PayForm__buttonSubmit} ${styles.buttonSubmit}`}
                                disabled={!account || !isEmailActive || !amountToClient}
                            >
                                Оплатить {amountToOur ? `${getAmountWithOurCommissionInRub({ amount: amountToClient ?? 0, clientCurrencyType: activeCurrency, topUpAccountConfig: topUpAccountConfig as TopUpAccountConfigWrapperFrontend, exchangeRateWrapper  })} RUB` : ''}
                            </Button>
                        </Tooltip>
                        <Text className={`${styles.PayForm__descr}`}>
                            Нажимая “Оплатить”, вы принимаете условия Пользовательского соглашения и Политику
                            конфиденциальности
                        </Text>
                    </Flex>
                </Spin>
            </form>
            <ModalWrapper>
                <Modal
                    open={openModal}
                    centered
                    className={`${styles.PayForm__modal}`}
                    onCancel={hideModal}
                    styles={{
                        content: { backgroundColor: 'transparent' },
                    }}
                    closeIcon={
                        <CloseOutlined style={{ color: '#5F6066', fontSize: '20px' }}/>
                    }
                    footer={<></>}
                >
                    <Flex
                        vertical
                        gap={24}
                    >
                        <Title
                            className={`${styles.PayForm__modalTitle}`}
                            level={2}
                            style={{ margin: '0' }}
                        >
                            Как узнать логин?
                        </Title>
                        <Image
                            className={`${styles.PayForm__modalImage}`}
                            layout="responsive"
                            src={modalImg}
                            alt={'modal image'}
                        />
                        <Text
                            className={`${styles.PayForm__modalText}`}
                            style={{ fontSize: theme.token.fontSize, color: '#9A9BA2' }}
                        >
                            Логин это то, что вы указываете при входе в Steam. Если вы укажете неверный логин, то
                            средства уйдут другому пользователю.
                        </Text>
                        <Link className={`${styles.PayForm__modalLink}`} href="https://store.steampowered.com/account/" target={"_blank"}>Открыть страницу Steam с логином</Link>
                    </Flex>
                </Modal>
                <Modal
                    open={openModalCountries}
                    centered
                    className={`${styles.PayForm__modal}`}
                    onCancel={hideModalCountries}
                    styles={{
                        content: { backgroundColor: 'transparent' },
                    }}
                    closeIcon={
                        <CloseOutlined style={{ color: '#5F6066', fontSize: '20px' }} />
                    }
                    footer={<></>}
                >
                    <Flex
                        vertical
                        gap={24}
                    >
                        <Title
                            className={`${styles.PayForm__modalTitle}`}
                            level={2}
                            style={{ margin: '0' }}
                        >
                            Страны доступные к пополнению
                        </Title>
                        <Title
                            className={`${styles.PayForm__modalTitleSec}`}
                            level={5}
                            style={{ margin: '-12px 0 0 0', fontSize: theme.token.fontSize, color: '#9A9BA2' }}
                        >
                            Пополняем все страны СНГ.
                        </Title>
                        <Flex
                            className={`${styles.PayForm__modalCountriesListWrap}`}
                            gap={12}
                        >
                            <Flex
                                vertical
                                gap={12}
                                className={`${styles.PayForm__modalCountriesList}`}
                            >
                                <Flex
                                    className="PayForm__modalCountriesListItem"
                                    gap={12}
                                >
                                    <Image
                                        src={flagModalRu}
                                        alt={'flag ru'}
                                        width={24}
                                        height={24}
                                    />
                                    <Text>Россия</Text>
                                </Flex>
                                <Flex
                                    className="PayForm__modalCountriesListItem"
                                    gap={12}
                                >
                                    <Image
                                        src={flagModalKz}
                                        alt={'flag kz'}
                                        width={24}
                                        height={24}
                                    />
                                    <Text>Казахстан</Text>
                                </Flex>
                                <Flex
                                    className="PayForm__modalCountriesListItem"
                                    gap={12}
                                >
                                    <Image
                                        src={flagModalBy}
                                        alt={'flag by'}
                                        width={24}
                                        height={24}
                                    />
                                    <Text>Беларусь</Text>
                                </Flex>
                                <Flex
                                    className="PayForm__modalCountriesListItem"
                                    gap={12}
                                >
                                    <Image
                                        src={flagModalAm}
                                        alt={'flag am'}
                                        width={24}
                                        height={24}
                                    />
                                    <Text>Армения</Text>
                                </Flex>
                                <Flex
                                    className="PayForm__modalCountriesListItem"
                                    gap={12}
                                >
                                    <Image
                                        src={flagModalGe}
                                        alt={'flag ge'}
                                        width={24}
                                        height={24}
                                    />
                                    <Text>Армения</Text>
                                </Flex>
                            </Flex>
                            <Flex
                                vertical
                                gap={12}
                                className={`${styles.PayForm__modalCountriesList}`}
                            >
                                <Flex
                                    className="PayForm__modalCountriesListItem"
                                    gap={12}
                                >
                                    <Image
                                        src={flagModalKy}
                                        alt={'flag ky'}
                                        width={24}
                                        height={24}
                                    />
                                    <Text>Киргизия</Text>
                                </Flex>
                                <Flex
                                    className="PayForm__modalCountriesListItem"
                                    gap={12}
                                >
                                    <Image
                                        src={flagModalUz}
                                        alt={'flag uz'}
                                        width={24}
                                        height={24}
                                    />
                                    <Text>Узбекистан</Text>
                                </Flex>
                                <Flex
                                    className="PayForm__modalCountriesListItem"
                                    gap={12}
                                >
                                    <Image
                                        src={flagModalAz}
                                        alt={'flag az'}
                                        width={24}
                                        height={24}
                                    />
                                    <Text>Азербайджан</Text>
                                </Flex>
                                <Flex
                                    className="PayForm__modalCountriesListItem"
                                    gap={12}
                                >
                                    <Image
                                        src={flagModalTj}
                                        alt={'flag tj'}
                                        width={24}
                                        height={24}
                                    />
                                    <Text>Таджикистан</Text>
                                </Flex>
                            </Flex>
                        </Flex>
                        <Text
                            className={`${styles.PayForm__modalText}`}
                            style={{ fontSize: theme.token.fontSize, color: '#9A9BA2' }}
                        >
                            Мы также пополняем регионы Крым, ЛНР и ДНР, если у вас появились трудности с пополнением данного региона, <Link className={`${styles.PayForm__modalLink}`} href="https://t.me/Dessly_sup_bot" target={"_blank"}>напишите в поддержку</Link>,
                            мы поможем вам :)
                        </Text>
                    </Flex>
                </Modal>
            </ModalWrapper>
        </>
    );
};

export default PayForm;
