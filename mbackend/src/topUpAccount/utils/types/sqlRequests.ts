'use strict';

import { ITable_ShopTransactionUserInfo_Input } from "../../types/topUpAccount";

export const enum TableNames {
    Users = 'users',
    PayGatewayInputPalychCreateBillRequest = 'pay_gateway_input_palych_create_bill_request',
    PayGatewayInputPalychCreateBillResponse = 'pay_gateway_input_palych_create_bill_response',
    PayGatewayInputPalychPostbackNotification = 'pay_gateway_input_palych_postback_notification',
    //
    PayGatewayInputAntilopayCreateBillRequest = "pay_gateway_input_antilopay_create_bill_request",
    PayGatewayInputAntilopayCreateBillResponse = "pay_gateway_input_antilopay_create_bill_response",
    PayGatewayInputAntilopayPostbackNotification = "pay_gateway_input_antilopay_postback_notification",
    //
    PayGatewayOutputInterhubCheckRequest = 'pay_gateway_output_interhub_check_request',
    PayGatewayOutputInterhubCheckResponse = 'pay_gateway_output_interhub_check_response',
    PayGatewayOutputInterhubPayRequest = 'pay_gateway_output_interhub_pay_request',
    PayGatewayOutputInterhubPayResponse = 'pay_gateway_output_interhub_pay_response',
    //
    shopTransactionInfo = 'shop_transaction_info',
    ShopTransaction = 'shop_transaction',
    PayGatewayInputPalych = "pay_gateway_input_palych",
    PayGatewayInputAntilopay = "pay_gateway_input_antilopay",
    PayGatewayOutputInterhub = "pay_gateway_output_interhub",
    PayGatewayInput = "pay_gateway_input",
    PayGatewayOutput = "pay_gateway_output",
    ShopTransactionUserInfo = "shop_transaction_user_info",
    //
    CurrencyType = "currency_type",
}

export const enum Table_Users_Columns {
    Id = "id",
    CreatedAt = "created_at",
}

export const enum Table_CurrencyType_Columns {
    Id = "id",
    CreatedAt = "created_at",
    CurrencyTypeCode = "currency_type_code",
    Description = "description",
}

export const enum Table_ShopTransactionUserInfo_Columns {
    Id = "id",
    CreatedAt = "created_at",
    Email = "email",
    ShopTransactionId = "shop_transaction_id",
}

export const enum Table_ShopTransaction_Columns {
    Id = "id",
    CreatedAt = "created_at",
    UserId = "user_id",
    StatusId = "status_id",
    ProgressId = "progress_id",
    ErrorCodeId = "error_code_id",
    ErrorReasonCodeId = "error_reason_code_id",
}

export const enum Table_ShopTransactionInfo_Columns {
    Id = "id",
    CreatedAt = "created_at",
    UpdatedAt = "updated_at",
    CommissionRate = "commission_rate",
    //
    PayGatewayBeforeOutputCurrencyTypeId = "pay_gateway_before_output_currency_type_id",
    PayGatewayBeforeOutputExchangeRate = "pay_gateway_before_output_exchange_rate",
    PayGatewayBeforeOutputAmount = "pay_gateway_before_output_amount",
    //
    PayGatewayInputCurrencyTypeId = "pay_gateway_input_currency_type_id",
    PayGatewayInputExchangeRate = "pay_gateway_input_exchange_rate",
    PayGatewayInputAmount = "pay_gateway_input_amount",
    //
    PayGatewayOutputCurrencyTypeId = "pay_gateway_output_currency_type_id",
    PayGatewayOutputExchangeRate = "pay_gateway_output_exchange_rate",
    PayGatewayOutputAmount = "pay_gateway_output_amount",
    //
    Description = "description",
    ShopTransactionId = "shop_transaction_id",
}

export const enum Table_PayGatewayInput_Columns {
    Id = "id",
    CreatedAt = "created_at",
    ShopTransactionId = "shop_transaction_id",
}

export const enum Table_PayGatewayOutput_Columns {
    Id = "id",
    CreatedAt = "created_at",
    ShopTransactionId = "shop_transaction_id",
}

export const enum Table_PayGatewayInputPalych_Columns {
    Id = "id",
    CreatedAt = "created_at",
    PayGatewayInputId = "pay_gateway_input_id",
}

export const enum Table_PayGatewayInputAntilopay_Columns {
    Id = "id",
    CreatedAt = "created_at",
    PayGatewayInputId = "pay_gateway_input_id",
}

export const enum Table_PayGatewayOutputInterhub_Columns {
    Id = "id",
    CreatedAt = "created_at",
    PayGatewayOutputId = "pay_gateway_output_id",
}

export const enum Table_PayGatewayInputPalychCreateBill_Request_Columns {
    Id = "id",
    CreatedAt = "created_at",
    OrderId = "order_id",
    ShopId = "shop_id",
    Amount = "amount",
    CurrencyType = "currency_type",
    Description = "description",
    PayerPaysCommission = "payer_pays_commission",
    Type = "type",
    Custom = "custom",
    Name = "name",
    PayerEmail = "payer_email",
    PayGatewayInputPalychId = "pay_gateway_input_palych_id",
}

export const enum Table_PayGatewayInputPalychCreateBill_Response_Columns {
    Id = "id",
    CreatedAt = "created_at",
    Success = "success",
    LinkUrl = "link_url",
    LinkPageUrl = "link_page_url",
    BillId = "bill_id",
    PayGatewayInputPalychId = "pay_gateway_input_palych_id",
}

export const enum Table_PayGatewayInputPalychPostbackNotification_Columns {
    Id = "id",
    CreatedAt = "created_at",
    OrderId = "order_id",
    OutSum = "out_sum",
    CurrencyIn = "currency_in",
    Commission = "commission",
    Currency = "currency",
    TrsId = "trs_id",
    Status = "status",
    Custom = "custom",
    AccountNumber = "account_number",
    AccountType = "account_type",
    BalanceAmount = "balance_amount",
    BalanceCurrency = "balance_currency",
    ErrorCode = "error_code",
    ErrorMessage = "error_message",
    SignatureValue = "signature_value",
    PayGatewayInputPalychId = "pay_gateway_input_palych_id",
}

export const enum Table_PayGatewayInputAntilopayCreateBill_Request_Columns {
    Id = "id",
    CreatedAt = "created_at",
    ProjectIdentificator = "project_identificator",
    Amount = "amount",
    OrderId = "order_id",
    Currency = "currency",
    ProductName = "product_name",
    ProductType = "product_type",
    ProductQuantity = "product_quantity",
    Vat = "vat",
    Description = "description",
    SuccessUrl = "success_url",
    FailUrl = "fail_url",
    Customer = "customer",
    PayGatewayInputAntilopayId = "pay_gateway_input_antilopay_id",
}

export const enum Table_PayGatewayInputAntilopayCreateBill_Response_Columns {
    Id = "id",
    CreatedAt = "created_at",
    Code = "code",
    PaymentId = "payment_id",
    PaymentUrl = "payment_url",
    Error = "error",
    PayGatewayInputAntilopayId = "pay_gateway_input_antilopay_id",
}

export const enum Table_PayGatewayInputAntilopayPostbackNotification_Columns {
    Id = "id",
    CreatedAt = "created_at",
    Type = "type",
    PaymentId = "payment_id",
    OrderId = "order_id",
    Ctime = "ctime",
    Amount = "amount",
    OriginalAmount = "original_amount",
    Fee = "fee",
    Status = "status",
    Currency = "currency",
    ProductName = "product_name",
    Description = "description",
    PayMethod = "pay_method",
    PayData = "pay_data",
    CustomerIp = "customer_ip",
    CustomerUseragent = "customer_useragent",
    Customer = "customer",
    PayGatewayInputAntilopayId = "pay_gateway_input_antilopay_id",
}

export const enum Table_PayGatewayOutputInterhubCheckRequest_Columns {
    Id = "id",
    CreatedAt = "created_at",
    AgentTransactionId = "agent_transaction_id",
    Amount = "amount",
    Account = "account",
    ServiceId = "service_id",
    PayGatewayOutputInterhubId = "pay_gateway_output_interhub_id",
}

export const enum Table_PayGatewayOutputInterhubCheckResponse_Columns {
    Id = "id",
    CreatedAt = "created_at",
    TransactionId = "transaction_id",
    AmountInCurrency = "amount_in_currency",
    Message = "message",
    Amount = "amount",
    Commission = "commission",
    Account = "account",
    Currency = "currency",
    Success = "success",
    PayGatewayOutputInterhubId = "pay_gateway_output_interhub_id",
}

export const enum Table_PayGatewayOutputInterhubPayRequest_Columns {
    Id = "id",
    CreatedAt = "created_at",
    AgentTransactionId = "agent_transaction_id",
    PayGatewayOutputInterhubId = "pay_gateway_output_interhub_id",
}

export const enum Table_PayGatewayOutputInterhubPayResponse_Columns {
    Id = "id",
    CreatedAt = "created_at",
    AgentTransactionId = "agent_transaction_id",
    Success = "success",
    ErrorCode = "error_code",
    Data = "data",
    Message = "message",
    PayGatewayOutputInterhubId = "pay_gateway_output_interhub_id",
}
