DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = current_schema()) LOOP
        EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
    END LOOP;
END $$;

--
CREATE TABLE digi_code (
    id serial PRIMARY KEY,
    username VARCHAR(255),
    paid DECIMAL(10, 2),
    time BIGINT
);

CREATE TABLE notification (
	id serial PRIMARY KEY,
    transaction_id VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    user_ip VARCHAR(45) NOT NULL,
    order_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE paypalych_bill (
    id serial PRIMARY KEY,
    link_url VARCHAR(255),
    link_pageUrl VARCHAR(255),
    billId VARCHAR(255)
);

CREATE TABLE paypalych_notification (
	id serial PRIMARY KEY,
    inv_id VARCHAR(255),
    trs_id VARCHAR(255),
    out_sum FLOAT,
    commission FLOAT,
    status VARCHAR(255),
    currency_in VARCHAR(50),
    account_type VARCHAR(50),
    account_number VARCHAR(255),
    error_code VARCHAR(255),
    error_message VARCHAR(255),
    signature_value VARCHAR(255)
);

CREATE TABLE steam_bot_config (
	id serial PRIMARY KEY,
    api_key VARCHAR(255),
    commission_rate FLOAT,
    paypalych_shop_id VARCHAR(255),
    pay_commission INT,
    payment_min_value FLOAT,
    payment_max_value FLOAT
);

CREATE TABLE steam_users (
	id serial PRIMARY KEY,
    steam_login VARCHAR(255),
    licens_accept BOOLEAN,
    total_replenishment FLOAT
);

CREATE TABLE transactions (
	id serial PRIMARY KEY,
    amount FLOAT CHECK (Amount >= 0),
    transaction_id VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL,
    user_ip VARCHAR(45) NOT NULL,
    transaction_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

SELECT * from steam_users


