SELECT
    -- shop_transaction table
    shop_transaction.created_at AS transaction_created_at,
    shop_transaction.updated_at AS transaction_updated_at,
    statuses.status_code AS transaction_status,
    transaction_progress.progress_code AS transaction_progress,
    shop_transaction.error_code_id AS transaction_error_code_id,
    ec.description AS transaction_error_description,
    er.description AS transaction_error_reason,

    -- users table
    users.created_at AS user_created_at,

    -- shop_transaction_user_info table
    shop_transaction_user_info.id AS sshop_transaction_user_info_id,
    shop_transaction_user_info.created_at AS shop_transaction_user_info_created_at,
    shop_transaction_user_info.email AS shop_transaction_user_info_email,

    -- user_account table
    user_account.created_at AS account_created_at,
    user_account.login AS account_login,
    user_account.password AS account_password,

    -- shop_transaction_info table
    shop_transaction_info.created_at AS transaction_info_created_at,
    shop_transaction_info.commission_rate AS commission_rate,
    currency_before_output.currency_type_code AS before_output_currency_type,
    shop_transaction_info.pay_gateway_before_output_exchange_rate AS before_output_exchange_rate,
    currency_input.currency_type_code AS input_currency_type,
    shop_transaction_info.pay_gateway_input_exchange_rate AS input_exchange_rate,
    currency_output.currency_type_code AS output_currency_type,
    shop_transaction_info.pay_gateway_output_exchange_rate AS output_exchange_rate,
    shop_transaction_info.description AS transaction_description,

    -- pay_gateway_input table
    pay_gateway_input.created_at AS input_created_at,

    -- pay_gateway_input_palych table
    pay_gateway_input_palych.created_at AS input_palych_created_at,

    -- pay_gateway_input_antilopay table
    pay_gateway_input_antilopay.created_at AS input_antilopay_created_at,

    -- pay_gateway_input_palych_create_bill_request table
    pay_gateway_input_palych_create_bill_request.created_at AS palych_bill_create_created_at,
    pay_gateway_input_palych_create_bill_request.order_id AS palych_order_id,
    pay_gateway_input_palych_create_bill_request.shop_id AS palych_shop_id,
    pay_gateway_input_palych_create_bill_request.amount AS palych_amount,
    pay_gateway_input_palych_create_bill_request.currency_type AS palych_currency_type,
    pay_gateway_input_palych_create_bill_request.description AS palych_description,

    -- pay_gateway_input_palych_postback_notification table
    pay_gateway_input_palych_postback_notification.created_at AS palych_postback_created_at,
    pay_gateway_input_palych_postback_notification.order_id AS palych_postback_order_id,
    pay_gateway_input_palych_postback_notification.trs_id AS palych_postback_trs_id,
    pay_gateway_input_palych_postback_notification.out_sum AS palych_postback_out_sum,
    pay_gateway_input_palych_postback_notification.currency_in AS palych_postback_currency_in,
    pay_gateway_input_palych_postback_notification.commission AS palych_postback_commission,
    pay_gateway_input_palych_postback_notification.currency AS palych_postback_currency,
    pay_gateway_input_palych_postback_notification.status AS palych_postback_status,

    -- pay_gateway_output table
    pay_gateway_output.created_at AS output_created_at,

    -- pay_gateway_output_interhub table
    pay_gateway_output_interhub.created_at AS output_interhub_created_at,

    -- pay_gateway_output_interhub_check_request table
    pay_gateway_output_interhub_check_request.agent_transaction_id AS interhub_check_agent_transaction_id,
    pay_gateway_output_interhub_check_request.service_id AS interhub_check_service_id,
    pay_gateway_output_interhub_check_request.amount AS interhub_check_amount,
    pay_gateway_output_interhub_check_request.account AS interhub_check_account,

    -- pay_gateway_output_interhub_check_response table
    pay_gateway_output_interhub_check_response.transaction_id AS interhub_transaction_id,
    pay_gateway_output_interhub_check_response.amount AS interhub_check_amount,
    pay_gateway_output_interhub_check_response.currency AS interhub_check_currency,
    pay_gateway_output_interhub_check_response.success AS interhub_check_success,

    -- pay_gateway_output_interhub_pay_request table
    pay_gateway_output_interhub_pay_request.agent_transaction_id AS interhub_pay_agent_transaction_id,

    -- pay_gateway_output_interhub_pay_response table
    pay_gateway_output_interhub_pay_response.message AS interhub_pay_message,
    pay_gateway_output_interhub_pay_response.success AS interhub_pay_success,
    pay_gateway_output_interhub_pay_response.error_code AS interhub_pay_error_code,
    pay_gateway_output_interhub_pay_response.data AS interhub_pay_data,

    -- error_code table (second instance for interhub_pay_response errors)
    ec2.description AS interhub_pay_error_description,

    -- pay_gateway_input_antilopay_create_bill_request table
    pay_gateway_input_antilopay_create_bill_request.project_identificator AS antilopay_project_id,
    pay_gateway_input_antilopay_create_bill_request.amount AS antilopay_amount,
    pay_gateway_input_antilopay_create_bill_request.order_id AS antilopay_order_id,
    pay_gateway_input_antilopay_create_bill_request.currency AS antilopay_currency,
    pay_gateway_input_antilopay_create_bill_request.product_name AS antilopay_product_name,
    pay_gateway_input_antilopay_create_bill_request.customer AS antilopay_customer,

    -- pay_gateway_input_antilopay_create_bill_response table
    pay_gateway_input_antilopay_create_bill_response.payment_id AS antilopay_payment_id,
    pay_gateway_input_antilopay_create_bill_response.payment_url AS antilopay_payment_url,
    pay_gateway_input_antilopay_create_bill_response.error AS antilopay_error

FROM shop_transaction
LEFT JOIN statuses ON shop_transaction.status_id = statuses.id
LEFT JOIN transaction_progress ON shop_transaction.progress_id = transaction_progress.id
LEFT JOIN error_code ec ON shop_transaction.error_code_id = ec.id
LEFT JOIN error_reason_code er ON shop_transaction.error_reason_code_id = er.id
LEFT JOIN users ON shop_transaction.user_id = users.id
LEFT JOIN user_account ON user_account.user_id = users.id
LEFT JOIN shop_transaction_info ON shop_transaction_info.shop_transaction_id = shop_transaction.id
LEFT JOIN shop_transaction_user_info ON shop_transaction_user_info.shop_transaction_id = shop_transaction.id
LEFT JOIN currency_type currency_before_output ON shop_transaction_info.pay_gateway_before_output_currency_type_id = currency_before_output.id
LEFT JOIN currency_type currency_input ON shop_transaction_info.pay_gateway_input_currency_type_id = currency_input.id
LEFT JOIN currency_type currency_output ON shop_transaction_info.pay_gateway_output_currency_type_id = currency_output.id
LEFT JOIN pay_gateway_input ON pay_gateway_input.shop_transaction_id = shop_transaction.id
LEFT JOIN pay_gateway_input_palych ON pay_gateway_input_palych.pay_gateway_input_id = pay_gateway_input.id
LEFT JOIN pay_gateway_input_antilopay ON pay_gateway_input_antilopay.pay_gateway_input_id = pay_gateway_input.id
LEFT JOIN pay_gateway_input_palych_create_bill_request ON pay_gateway_input_palych_create_bill_request.pay_gateway_input_palych_id = pay_gateway_input_palych.id
LEFT JOIN pay_gateway_input_palych_postback_notification ON pay_gateway_input_palych_postback_notification.pay_gateway_input_palych_id = pay_gateway_input_palych.id
LEFT JOIN pay_gateway_output ON pay_gateway_output.shop_transaction_id = shop_transaction.id
LEFT JOIN pay_gateway_output_interhub ON pay_gateway_output_interhub.pay_gateway_output_id = pay_gateway_output.id
LEFT JOIN pay_gateway_output_interhub_check_request ON pay_gateway_output_interhub_check_request.pay_gateway_output_interhub_id = pay_gateway_output_interhub.id
LEFT JOIN pay_gateway_output_interhub_check_response ON pay_gateway_output_interhub_check_response.pay_gateway_output_interhub_id = pay_gateway_output_interhub.id
LEFT JOIN pay_gateway_output_interhub_pay_request ON pay_gateway_output_interhub_pay_request.pay_gateway_output_interhub_id = pay_gateway_output_interhub.id
LEFT JOIN pay_gateway_output_interhub_pay_response ON pay_gateway_output_interhub_pay_response.pay_gateway_output_interhub_id = pay_gateway_output_interhub.id
LEFT JOIN error_code ec2 ON pay_gateway_output_interhub_pay_response.error_code = ec2.id
LEFT JOIN pay_gateway_input_antilopay_create_bill_request ON pay_gateway_input_antilopay_create_bill_request.pay_gateway_input_antilopay_id = pay_gateway_input_antilopay.id
LEFT JOIN pay_gateway_input_antilopay_create_bill_response ON pay_gateway_input_antilopay_create_bill_response.pay_gateway_input_antilopay_id = pay_gateway_input_antilopay.id
ORDER BY shop_transaction.created_at DESC;
