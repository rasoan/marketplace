SELECT
    -- Данные из shop_transaction
    st.id AS transaction_id,
    st.created_at AS transaction_created_at,
    st.updated_at AS transaction_updated_at,

    -- Данные из shop_transaction_user_info
    stui.email AS stui_email,

    -- Данные из shop_transaction_info
    sti.commission_rate AS commission_rate,
    sti.pay_gateway_before_output_exchange_rate AS client_exchange_rate,
    ctb.currency_type_code AS client_currency_code,
    sti.pay_gateway_before_output_amount AS client_amount,
    sti.pay_gateway_input_exchange_rate AS our_exchange_rate,
    cti.currency_type_code AS our_currency_code,
    sti.pay_gateway_input_amount AS our_amount,
    sti.pay_gateway_output_exchange_rate AS interhub_exchange_rate,
    cto.currency_type_code AS interhub_currency_code,
    sti.pay_gateway_output_amount AS interhub_amount,

    -- Данные из pay_gateway_input_antilopay_create_bill_request
    pgia_cbr.amount AS antilopay_cbreq_amount,
    pgia_cbres.payment_url AS antilopay_cbreq_payment_url,

    -- Данные из pay_gateway_input_antilopay_postback_notification
    pgia_pn.amount AS antilopay_pn_amount,
    pgia_pn.status AS antilopay_pn_status,

    -- Данные из pay_gateway_output_interhub_check_request
    pgoi_cr.amount AS interhub_check_req_amount,
    pgoi_cr.account AS interhub_check_req_account,

    -- Данные из pay_gateway_output_interhub_pay_response
    pgoi_pres.success AS interhub_pay_res_success

FROM
    shop_transaction st
    -- Связь с users через st.user_id
    LEFT JOIN users u ON st.user_id = u.id
    -- Связь с user_account через u.id
    LEFT JOIN user_account ua ON u.id = ua.user_id
    -- Связь с statuses через st.status_id
    LEFT JOIN statuses s ON st.status_id = s.id
    -- Связь с transaction_progress через st.progress_id
    LEFT JOIN transaction_progress tp ON st.progress_id = tp.id
    -- Связь с error_code через st.error_code_id
    LEFT JOIN error_code ec ON st.error_code_id = ec.id
    -- Связь с error_reason_code через st.error_reason_code_id
    LEFT JOIN error_reason_code erc ON st.error_reason_code_id = erc.id
    -- Связь с shop_transaction_user_info через st.id
    LEFT JOIN shop_transaction_user_info stui ON st.id = stui.shop_transaction_id
    -- Связь с shop_transaction_info через st.id
    LEFT JOIN shop_transaction_info sti ON st.id = sti.shop_transaction_id
    -- Связь с currency_type для before_output
    LEFT JOIN currency_type ctb ON sti.pay_gateway_before_output_currency_type_id = ctb.id
    -- Связь с currency_type для input
    LEFT JOIN currency_type cti ON sti.pay_gateway_input_currency_type_id = cti.id
    -- Связь с currency_type для output
    LEFT JOIN currency_type cto ON sti.pay_gateway_output_currency_type_id = cto.id
    -- Связь с pay_gateway_input через st.id
    LEFT JOIN pay_gateway_input pgi ON st.id = pgi.shop_transaction_id
    -- Связь с pay_gateway_input_antilopay через pgi.id
    LEFT JOIN pay_gateway_input_antilopay pgia ON pgi.id = pgia.pay_gateway_input_id
    -- Связь с pay_gateway_input_antilopay_create_bill_request через pgia.id
    LEFT JOIN pay_gateway_input_antilopay_create_bill_request pgia_cbr ON pgia.id = pgia_cbr.pay_gateway_input_antilopay_id
    -- Связь с pay_gateway_input_antilopay_create_bill_response через pgia.id
    LEFT JOIN pay_gateway_input_antilopay_create_bill_response pgia_cbres ON pgia.id = pgia_cbres.pay_gateway_input_antilopay_id
    -- Связь с pay_gateway_input_antilopay_postback_notification через pgia.id
    LEFT JOIN pay_gateway_input_antilopay_postback_notification pgia_pn ON pgia.id = pgia_pn.pay_gateway_input_antilopay_id
    -- Связь с pay_gateway_output через st.id
    LEFT JOIN pay_gateway_output pgo ON st.id = pgo.shop_transaction_id
    -- Связь с pay_gateway_output_interhub через pgo.id
    LEFT JOIN pay_gateway_output_interhub pgoi ON pgo.id = pgoi.pay_gateway_output_id
    -- Связь с pay_gateway_output_interhub_check_request через pgoi.id
    LEFT JOIN pay_gateway_output_interhub_check_request pgoi_cr ON pgoi.id = pgoi_cr.pay_gateway_output_interhub_id
    -- Связь с pay_gateway_output_interhub_check_response через pgoi.id
    LEFT JOIN pay_gateway_output_interhub_check_response pgoi_cres ON pgoi.id = pgoi_cres.pay_gateway_output_interhub_id
    -- Связь с pay_gateway_output_interhub_pay_request через pgoi.id
    LEFT JOIN pay_gateway_output_interhub_pay_request pgoi_pr ON pgoi.id = pgoi_pr.pay_gateway_output_interhub_id
    -- Связь с pay_gateway_output_interhub_pay_response через pgoi.id
    LEFT JOIN pay_gateway_output_interhub_pay_response pgoi_pres ON pgoi.id = pgoi_pres.pay_gateway_output_interhub_id
WHERE pgia_cbres.payment_url <> 'https://gate.antilopay.com/#payment/APAY4AA6BB4B1701155257296'
AND pgia_pn.status = 'SUCCESS'
ORDER BY transaction_created_at DESC;
