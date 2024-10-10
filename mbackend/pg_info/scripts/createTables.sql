DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = current_schema()) LOOP
        EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
    END LOOP;

    -- Удаляем ENUM типы
    FOR r IN (SELECT typname FROM pg_type WHERE typtype = 'e') LOOP
        -- Каскадное удаление каждого ENUM типа
        EXECUTE 'DROP TYPE IF EXISTS ' || quote_ident(r.typname) || ' CASCADE';
    END LOOP;
END $$;

-- удалить все тригеры
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT trigger_name, event_object_table
              FROM information_schema.triggers
              WHERE trigger_schema = 'public')
    LOOP
        EXECUTE 'DROP TRIGGER IF EXISTS ' || r.trigger_name || ' ON ' || r.event_object_table || ' CASCADE';
    END LOOP;
END $$;


-- удалить все функции
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT routine_name
              FROM information_schema.routines
              WHERE routine_type = 'FUNCTION'
              AND specific_schema = 'public')
    LOOP
        EXECUTE 'DROP FUNCTION IF EXISTS ' || r.routine_name || ' CASCADE';
    END LOOP;
END $$;



CREATE TYPE currency_type_enum AS ENUM (
    'RUB',
    'USD',
    'UAH',
    'KZT'
);

CREATE TYPE status_code_enum AS ENUM (
    'IN_PROGRESS',
    'ERROR',
    'SUCCESS'
);

CREATE TYPE transaction_progress_code_enum AS ENUM (
    'CREATING_BILL',
    'PAYING_BILL',
    'PAYING_CLIENT',
    'SUCCESS'
);

CREATE TYPE error_reason_code_enum AS ENUM (
    'PAY_GATEWAY_INPUT',
    'PAY_GATEWAY_OUTPUT',
    'API_EXCHANGE_RATE',
    'BACKEND',
    'DATABASE',
    'CLIENT',
    'UNKNOWN'
);

CREATE TYPE error_code_enum AS ENUM (
    'REQUEST_TIMEOUT',
    'CLIENT_TIMEOUT',
    'UNKNOWN'
 );

CREATE TABLE currency_type (
	id serial PRIMARY KEY,
    -- дата и время создания записи
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    currency_type_code currency_type_enum UNIQUE NOT NULL,
    description VARCHAR(255)
);

INSERT INTO currency_type (currency_type_code, description)
VALUES
    ('RUB', 'Russia'),
    ('USD', 'U.S.A.'),
    ('UAH', 'Ukraine'),
    ('KZT', 'Kazakhstan');

CREATE TABLE statuses (
	id serial PRIMARY KEY,
    -- дата и время создания записи
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status_code status_code_enum UNIQUE NOT NULL,
    description VARCHAR(255)
);

INSERT INTO statuses (status_code, description)
VALUES
    ('IN_PROGRESS', 'Process is progressing'),
    ('ERROR', 'Finished with error'),
    ('SUCCESS', 'Successfully completed');

CREATE TABLE transaction_progress (
	id serial PRIMARY KEY,
    -- дата и время создания записи
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    progress_code transaction_progress_code_enum UNIQUE NOT NULL,
    description VARCHAR(255)
);

INSERT INTO transaction_progress (progress_code, description)
VALUES
    ('CREATING_BILL', 'Creating a bill for payment'),
    ('PAYING_BILL', 'Paying the bill'),
    ('PAYING_CLIENT', 'Paying the client'),
    ('SUCCESS', 'Transaction successfully completed');

CREATE TABLE error_code (
	id serial PRIMARY KEY,
    -- дата и время создания записи
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    code error_code_enum UNIQUE NOT NULL,
    description VARCHAR(255)
);

INSERT INTO error_code (code, description)
VALUES
    ('REQUEST_TIMEOUT', 'Expiration of the request waiting time'),
    ('CLIENT_TIMEOUT', 'Client inactivity time limit exceeded'),
    ('UNKNOWN', 'Unknown error');

CREATE TABLE error_reason_code (
	id serial PRIMARY KEY,
    -- дата и время создания записи
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reason_code error_reason_code_enum UNIQUE NOT NULL,
    description VARCHAR(255)
);

INSERT INTO error_reason_code (reason_code, description)
VALUES
    ('PAY_GATEWAY_INPUT', 'Error on the incoming payment gateway side'),
    ('PAY_GATEWAY_OUTPUT', 'Error on the outgoing payment gateway side'),
    ('API_EXCHANGE_RATE', 'Error fetching currency exchange rate via API'),
    ('BACKEND', 'Backend system error'),
    ('DATABASE', 'Database error'),
    ('CLIENT', 'Client-side error'),
    ('UNKNOWN', 'Unknown error');

-- зарегистрированный пользователь
CREATE TABLE users (
	id serial PRIMARY KEY,
    -- дата и время создания записи
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- аккаунт
CREATE TABLE user_account (
	id serial PRIMARY KEY,
    -- дата и время создания записи
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

	--
	login VARCHAR(255) NOT NULL,
	--
	password VARCHAR(255) NOT NULL,

    user_id INT NOT NULL UNIQUE,
    CONSTRAINT fk_user_account__user_id FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE shop_transaction (
	id serial PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

	user_id INT,

	status_id INT NOT NULL,
	progress_id INT NOT NULL,
	error_code_id INT,
	error_reason_code_id INT,

    CONSTRAINT fk_transaction__user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_transaction__statuses FOREIGN KEY (status_id) REFERENCES statuses(id),
    CONSTRAINT fk_transaction__transaction_progress FOREIGN KEY (progress_id) REFERENCES transaction_progress(id),
    CONSTRAINT fk_transaction__error_code FOREIGN KEY (error_code_id) REFERENCES error_code(id),
    CONSTRAINT fk_transaction__error_reason_code FOREIGN KEY (error_reason_code_id) REFERENCES error_reason_code(id)
);

-- Создание функции, которая обновляет поле updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Создание триггера, который вызывает функцию при каждом обновлении записи
CREATE TRIGGER update_shop_transaction_updated_at
BEFORE UPDATE ON shop_transaction
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();

-- Информация о пользователе для транзакции
CREATE TABLE shop_transaction_user_info (
	id serial PRIMARY KEY,
    -- дата и время создания записи
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	-- почта (уникальна)
	email VARCHAR(255),

    shop_transaction_id INT NOT NULL UNIQUE,
    CONSTRAINT fk_shop_transaction_user_info__transaction FOREIGN KEY (shop_transaction_id) REFERENCES shop_transaction(id)
);

CREATE TABLE shop_transaction_info (
    id serial PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    --
    commission_rate DECIMAL(15,2) NOT NULL,
    --
    pay_gateway_before_output_currency_type_id INT NOT NULL,
    pay_gateway_before_output_exchange_rate DECIMAL(15,2) NOT NULL,
    pay_gateway_before_output_amount DECIMAL(15,2) NOT NULL,
    --
    pay_gateway_input_currency_type_id INT NOT NULL,
    pay_gateway_input_exchange_rate DECIMAL(15,2) NOT NULL,
    pay_gateway_input_amount DECIMAL(15,2) NOT NULL,
    --
    pay_gateway_output_currency_type_id INT NOT NULL,
    pay_gateway_output_exchange_rate DECIMAL(15,2) NOT NULL,
    pay_gateway_output_amount DECIMAL(15,2) NOT NULL,
    --
    description VARCHAR(255),

    shop_transaction_id INT NOT NULL UNIQUE,
    CONSTRAINT fk_shop_transaction_info__transaction FOREIGN KEY (shop_transaction_id) REFERENCES shop_transaction(id),
    CONSTRAINT fk_shop_transaction_info__pay_gate_befo_outp_cur_typ FOREIGN KEY (pay_gateway_before_output_currency_type_id) REFERENCES currency_type(id),
    CONSTRAINT fk_shop_transaction_info__pay_gateway_input_currency_type FOREIGN KEY (pay_gateway_input_currency_type_id) REFERENCES currency_type(id),
    CONSTRAINT fk_shop_transaction_info__pay_gateway_output_currency_type FOREIGN KEY (pay_gateway_output_currency_type_id) REFERENCES currency_type(id)
);

CREATE TABLE pay_gateway_input (
	id serial PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    shop_transaction_id INT UNIQUE,
    CONSTRAINT fk_pay_gateway_input__transaction FOREIGN KEY (shop_transaction_id) REFERENCES shop_transaction(id)
);

CREATE TABLE pay_gateway_output (
	id serial PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    shop_transaction_id INT UNIQUE,
    CONSTRAINT fk_pay_gateway_output__transaction FOREIGN KEY (shop_transaction_id) REFERENCES shop_transaction(id)
);

CREATE TABLE pay_gateway_input_palych (
	id serial PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

	pay_gateway_input_id INT NOT NULL,

    CONSTRAINT fk_pay_gateway_input_palych__pay_gateway_input FOREIGN KEY (pay_gateway_input_id) REFERENCES pay_gateway_input(id)
);

CREATE TABLE pay_gateway_input_antilopay (
	id serial PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

	pay_gateway_input_id INT NOT NULL,

    CONSTRAINT fk_pay_gateway_input_antilopay__pay_gateway_input FOREIGN KEY (pay_gateway_input_id) REFERENCES pay_gateway_input(id)
);

CREATE TABLE pay_gateway_output_interhub (
	id serial PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

	pay_gateway_output_id INT NOT NULL,

    CONSTRAINT fk_pay_gateway_output_interhub__pay_gateway_output FOREIGN KEY (pay_gateway_output_id) REFERENCES pay_gateway_output(id)
);

-- Счёт для оплаты клиента в palych.io
CREATE TABLE pay_gateway_input_palych_create_bill_request (
	id serial PRIMARY KEY,
    -- дата и время создания записи
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	-- идентификатор ордера на оплату
	order_id VARCHAR(255) NOT NULL,
	-- наш идентификатор
	shop_id VARCHAR(255) NOT NULL,
	-- сумма которая пошла в palych.io
	amount DECIMAL(15,2),
    -- тип валюты в которой пополнили (RUB, USD, EUR, etc..)
    currency_type VARCHAR(255),
	-- дополнительное описание от пользователя
	description VARCHAR(255),
	payer_pays_commission DECIMAL(15,2),
	type VARCHAR(255),
    custom VARCHAR(255),
    name VARCHAR(255),
    payer_email VARCHAR(255),

    -- Только один раз для текущей транзакции можем создать счёт, только 1 раз
    pay_gateway_input_palych_id INT NOT NULL UNIQUE,
    CONSTRAINT fk_palych_bill_create__pay_gateway_input_palych FOREIGN KEY (pay_gateway_input_palych_id) REFERENCES pay_gateway_input_palych(id)
);

CREATE TABLE pay_gateway_input_palych_create_bill_response (
	id serial PRIMARY KEY,
    -- дата и время создания записи
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    success BOOLEAN,
    link_url VARCHAR(255),
    link_page_url VARCHAR(255),
    bill_id VARCHAR(255),
    -- Только один раз для текущей транзакции можем создать счёт, только 1 раз
    pay_gateway_input_palych_id INT NOT NULL UNIQUE,
    CONSTRAINT fk_palych_bill_create_res__pay_gateway_input_palych FOREIGN KEY (pay_gateway_input_palych_id) REFERENCES pay_gateway_input_palych(id)
);

-- Оплата счёта в palych.io
CREATE TABLE pay_gateway_input_palych_postback_notification (
	id serial PRIMARY KEY,
    -- дата и время создания записи
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    order_id VARCHAR(255) NOT NULL,
    trs_id VARCHAR(255) NOT NULL,
    out_sum DECIMAL(15,2),
    currency_in VARCHAR(255),
    commission DECIMAL(15,2),
    currency VARCHAR(255),
    status VARCHAR(255),
    custom VARCHAR(255),
    account_number VARCHAR(255),
    account_type VARCHAR(255),
    balance_amount DECIMAL(15,2),
    balance_currency VARCHAR(255),
    error_code INT,
    error_message VARCHAR(255),
    signature_value VARCHAR(255),

    -- notifications может приходить несколько в рамках одной транзакции
    pay_gateway_input_palych_id INT, --  NOT NULL не добавляем в случае если не будет связей, что бы не терять данные о ошибочных postback_notification
    CONSTRAINT fk_palych_postback_notification__pay_gateway_input_palych FOREIGN KEY (pay_gateway_input_palych_id) REFERENCES pay_gateway_input_palych(id)
);

-- Счёт для оплаты клиента в antilopay
CREATE TABLE pay_gateway_input_antilopay_create_bill_request (
	id serial PRIMARY KEY,
    -- дата и время создания записи
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    project_identificator VARCHAR(255),
    amount DECIMAL(15,2),
    order_id VARCHAR(255),
    currency VARCHAR(255),
    product_name VARCHAR(255),
    product_type VARCHAR(255),
    product_quantity INT,
    vat DECIMAL(15,2),
    description VARCHAR(255),
    success_url VARCHAR(255),
    fail_url VARCHAR(255),
    customer VARCHAR(255),

    -- Только один раз для текущей транзакции можем создать счёт, только 1 раз
    pay_gateway_input_antilopay_id INT NOT NULL UNIQUE,
    CONSTRAINT fk_antilopay_bill_create_req__pay_gateway_input_antilopay FOREIGN KEY (pay_gateway_input_antilopay_id) REFERENCES pay_gateway_input_antilopay(id)
);

-- Счёт для оплаты клиента в antilopay
CREATE TABLE pay_gateway_input_antilopay_create_bill_response (
	id serial PRIMARY KEY,
    -- дата и время создания записи
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    code INT,
    payment_id VARCHAR(255),
    payment_url VARCHAR(255),
    error VARCHAR(255),

    -- Только один раз для текущей транзакции можем создать счёт, только 1 раз
    pay_gateway_input_antilopay_id INT NOT NULL UNIQUE,
    CONSTRAINT fk_antilopay_bill_create_res__pay_gateway_input_antilopay FOREIGN KEY (pay_gateway_input_antilopay_id) REFERENCES pay_gateway_input_antilopay(id)
);

-- postback notif
CREATE TABLE pay_gateway_input_antilopay_postback_notification (
	id serial PRIMARY KEY,
    -- дата и время создания записи
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    type VARCHAR(255),
    payment_id VARCHAR(255),
    order_id VARCHAR(255),
    ctime VARCHAR(255),
    amount DECIMAL(15,2),
    original_amount DECIMAL(15,2),
    fee DECIMAL(15,2),
    status VARCHAR(255),
    currency VARCHAR(255),
    product_name VARCHAR(255),
    description VARCHAR(255),
    pay_method VARCHAR(255),
    pay_data VARCHAR(255),
    customer_ip VARCHAR(255),
    customer_useragent VARCHAR(255),
    customer JSONB,

    -- Только один раз для текущей транзакции можем создать счёт, только 1 раз
    pay_gateway_input_antilopay_id INT NOT NULL UNIQUE,
    CONSTRAINT fk_antilopay_postback_notif__pay_gateway_input_antilopay FOREIGN KEY (pay_gateway_input_antilopay_id) REFERENCES pay_gateway_input_antilopay(id)
);

-- Данные которые пойдут в check
CREATE TABLE pay_gateway_output_interhub_check_request (
	id serial PRIMARY KEY,
    -- дата и время создания записи
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    agent_transaction_id VARCHAR(255) NOT NULL,
    -- сумма которая пошла на пополнение пользователю
    amount DECIMAL(15,2),
    account VARCHAR(255),
    service_id INT,

    -- Если каким-то образом клиента не пополнили, то можем дополнительно пополнить в рамках одной транзакции, значит поле не уникальное
    pay_gateway_output_interhub_id INT NOT NULL,
    CONSTRAINT fk_interhub_check_request_data__pay_gateway_output_interhub FOREIGN KEY (pay_gateway_output_interhub_id) REFERENCES pay_gateway_output_interhub(id)
);

-- Транзакция (например оплата steam)
CREATE TABLE pay_gateway_output_interhub_check_response (
	id serial PRIMARY KEY,
    -- дата и время создания записи
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- идентификатор транзакции
    transaction_id VARCHAR(255) NOT NULL,
    -- сумма которая пошла на пополнение пользователю
    amount DECIMAL(15,2),
    -- тип валюты в которой пополнили (RUB, USD, EUR, etc..)
    currency VARCHAR(255),
    -- если это значение в true, то оплата возможна
    success BOOLEAN,
    --
    message VARCHAR(255),
    status VARCHAR(255),
    --
    amount_in_currency DECIMAL(15,2),
    --
    commission DECIMAL(15,2),
    account VARCHAR(255),
    -- Если каким-то образом клиента не пополнили, то можем дополнительно пополнить в рамках одной транзакции, значит поле не уникальное
    pay_gateway_output_interhub_id INT NOT NULL,
    CONSTRAINT fk_interhub_check__pay_gateway_output_interhub FOREIGN KEY (pay_gateway_output_interhub_id) REFERENCES pay_gateway_output_interhub(id)
);

CREATE TABLE pay_gateway_output_interhub_pay_request (
	id serial PRIMARY KEY,
    -- дата и время создания записи
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    agent_transaction_id VARCHAR(255),

    -- Если каким-то образом клиента не пополнили, то можем дополнительно пополнить в рамках одной транзакции, значит поле не уникальное
    pay_gateway_output_interhub_id INT NOT NULL,

    CONSTRAINT fk_interhub_pay__pay_gateway_output_interhub FOREIGN KEY (pay_gateway_output_interhub_id) REFERENCES pay_gateway_output_interhub(id)
);

CREATE TABLE pay_gateway_output_interhub_pay_response (
	id serial PRIMARY KEY,
    -- дата и время создания записи
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    agent_transaction_id VARCHAR(255) NOT NULL,
    message VARCHAR(255),
    success BOOLEAN,
    error_code INT,
    data JSONB,
    -- Если каким-то образом клиента не пополнили, то можем дополнительно пополнить в рамках одной транзакции, значит поле не уникальное
    pay_gateway_output_interhub_id INT NOT NULL,

    CONSTRAINT fk_interhub_pay__pay_gateway_output_interhub FOREIGN KEY (pay_gateway_output_interhub_id) REFERENCES pay_gateway_output_interhub(id)
);
