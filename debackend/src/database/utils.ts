'use strict';

import { Pool } from "pg";

import {
    CurrencyType, ErrorCode,
    Status,
    TransactionErrorReasonCode,
    TransactionProgress,
} from "@deshopfrontend/src/utils/constants";
import { assertIsDefined } from "@detools/type_guards/base";

import {
    DataBaseCurrencyType,
    DataBaseErrorCode,
    DataBaseStatus,
    DataBaseTransactionErrorReasonCode,
    DataBaseTransactionProgress,
} from "./types/constants";
import { pgQueryAndNormaliseResponse, SqlRequestsGetter } from "../topUpAccount/utils/sqlRequsts";
import {
    Table_CurrencyType_Columns,
    TableNames,
} from "../topUpAccount/utils/types/sqlRequests";
import {
    ITable_CurrencyType_Output,
} from "../topUpAccount/types/topUpAccount";

export class DataBaseUtils {
    public static normalizeDataBaseCurrencyType(dataBaseCurrencyType: DataBaseCurrencyType): CurrencyType {
        switch (dataBaseCurrencyType) {
            case DataBaseCurrencyType.Rub: {
                return CurrencyType.Rub;
            }
            case DataBaseCurrencyType.Kzt: {
                return CurrencyType.Kzt;
            }
            case DataBaseCurrencyType.Usd: {
                return CurrencyType.Usd;
            }
            case DataBaseCurrencyType.Uah: {
                return CurrencyType.Uah;
            }
            default: {
                throw new Error(`Unknown dataBaseCurrencyType type: ${dataBaseCurrencyType}`);
            }
        }
    }

    public static normalizeDataBaseStatus(dataBaseStatus: DataBaseStatus): Status {
        switch (dataBaseStatus) {
            case DataBaseStatus.Error: {
                return Status.Error;
            }
            case DataBaseStatus.InProgress: {
                return Status.InProgress;
            }
            case DataBaseStatus.Success: {
                return Status.Success;
            }
            default: {
                throw new Error(`Unknown dataBaseStatus type: ${dataBaseStatus}`);
            }
        }
    }

    public static normalizeDataBaseTransactionProgress(dataBaseTransactionProgress: DataBaseTransactionProgress): TransactionProgress {
        switch (dataBaseTransactionProgress) {
            case DataBaseTransactionProgress.CreatingBill: {
                return TransactionProgress.CreatingBill;
            }
            case DataBaseTransactionProgress.PayingBill: {
                return TransactionProgress.PayingBill;
            }
            case DataBaseTransactionProgress.PayingClient: {
                return TransactionProgress.PayingClient;
            }
            case DataBaseTransactionProgress.Success: {
                return TransactionProgress.Success;
            }
            default: {
                throw new Error(`Unknown dataBaseTransactionProgress type: ${dataBaseTransactionProgress}`);
            }
        }
    }

    public static normalizeDataBaseTransactionErrorReasonCode(dataBaseTransactionErrorReasonCode: DataBaseTransactionErrorReasonCode): TransactionErrorReasonCode {
        switch (dataBaseTransactionErrorReasonCode) {
            case DataBaseTransactionErrorReasonCode.PayGatewayInput: {
                return TransactionErrorReasonCode.PayGatewayInput;
            }
            case DataBaseTransactionErrorReasonCode.PayGatewayOutput: {
                return TransactionErrorReasonCode.PayGatewayOutput;
            }
            case DataBaseTransactionErrorReasonCode.ApiExchangeRate: {
                return TransactionErrorReasonCode.ApiExchangeRate;
            }
            case DataBaseTransactionErrorReasonCode.Backend: {
                return TransactionErrorReasonCode.Backend;
            }
            case DataBaseTransactionErrorReasonCode.Database: {
                return TransactionErrorReasonCode.Database;
            }
            case DataBaseTransactionErrorReasonCode.Client: {
                return TransactionErrorReasonCode.Client;
            }
            case DataBaseTransactionErrorReasonCode.Unkonwn: {
                return TransactionErrorReasonCode.Unknown;
            }
            default: {
                throw new Error(`Unknown dataBaseTransactionErrorReasonCode ${dataBaseTransactionErrorReasonCode}`);
            }
        }
    }

    public static normalizeDataBaseErrorCode(dataBaseErrorCode: DataBaseErrorCode): ErrorCode {
        switch (dataBaseErrorCode) {
            case DataBaseErrorCode.RequestTimeout: {
                return ErrorCode.RequestTimeout;
            }
            case DataBaseErrorCode.ClientTimeout: {
                return ErrorCode.ClientTimeout;
            }
            case DataBaseErrorCode.Unknown: {
                return ErrorCode.Unknown;
            }
            default: {
                throw new Error(`Unknown dataBaseErrorCode ${dataBaseErrorCode}`);
            }
        }
    }

    public static currencyTypeToDataBase(currencyType: CurrencyType): DataBaseCurrencyType {
        switch (currencyType) {
            case CurrencyType.Rub: {
                return DataBaseCurrencyType.Rub;
            }
            case CurrencyType.Kzt: {
                return DataBaseCurrencyType.Kzt;
            }
            case CurrencyType.Usd: {
                return DataBaseCurrencyType.Usd;
            }
            case CurrencyType.Uah: {
                return DataBaseCurrencyType.Uah;
            }
            default: {
                throw new Error(`Unknown currencyType type: ${currencyType}`);
            }
        }
    }

    public static async getCurrencyType(currencyTypeRaw: CurrencyType, options: {
        pool: Pool,
    }): Promise<ITable_CurrencyType_Output | undefined> {
        const {
            pool,
        } = options;
        const currencyType = DataBaseUtils.currencyTypeToDataBase(currencyTypeRaw);

        let table_currencyType: ITable_CurrencyType_Output | undefined = void 0;

        // получаем строку из таблицы ITable_CurrencyType_Output
        {
            const {
                sqlRequest: currencyType_sqlRequest,
                values: currencyType_sqlRequestValues,
            } = SqlRequestsGetter.findOne(TableNames.CurrencyType, {
                where: {
                    value: currencyType,
                    name: Table_CurrencyType_Columns.CurrencyTypeCode,
                },
            });

            table_currencyType = await pgQueryAndNormaliseResponse<ITable_CurrencyType_Output>(
                pool,
                currencyType_sqlRequest,
                currencyType_sqlRequestValues,
            );

            assertIsDefined(
                table_currencyType,
                `Can't find table_payGatewayOutputInterhubCheckRequestData row! currencyTypeRaw is: ${currencyTypeRaw}`,
            );
        }

        return table_currencyType;
    }

    public static statusToDataBase(status: Status): DataBaseStatus {
        switch (status) {
            case Status.Error: {
                return DataBaseStatus.Error;
            }
            case Status.InProgress: {
                return DataBaseStatus.InProgress;
            }
            case Status.Success: {
                return DataBaseStatus.Success;
            }
            default: {
                throw new Error(`Unknown status type: ${status}`);
            }
        }
    }

    public static transactionProgressToDataBase(transactionProgress: TransactionProgress): DataBaseTransactionProgress {
        switch (transactionProgress) {
            case TransactionProgress.CreatingBill: {
                return DataBaseTransactionProgress.CreatingBill;
            }
            case TransactionProgress.PayingBill: {
                return DataBaseTransactionProgress.PayingBill;
            }
            case TransactionProgress.PayingClient: {
                return DataBaseTransactionProgress.PayingClient;
            }
            case TransactionProgress.Success: {
                return DataBaseTransactionProgress.Success;
            }
            default: {
                throw new Error(`Unknown transactionProgress type: ${transactionProgress}`);
            }
        }
    }

    public static transactionErrorReasonCodeToDataBase(transactionErrorReasonCode: TransactionErrorReasonCode): DataBaseTransactionErrorReasonCode {
        switch (transactionErrorReasonCode) {
            case TransactionErrorReasonCode.PayGatewayInput: {
                return DataBaseTransactionErrorReasonCode.PayGatewayInput;
            }
            case TransactionErrorReasonCode.PayGatewayOutput: {
                return DataBaseTransactionErrorReasonCode.PayGatewayOutput;
            }
            case TransactionErrorReasonCode.ApiExchangeRate: {
                return DataBaseTransactionErrorReasonCode.ApiExchangeRate;
            }
            case TransactionErrorReasonCode.Backend: {
                return DataBaseTransactionErrorReasonCode.Backend;
            }
            case TransactionErrorReasonCode.Database: {
                return DataBaseTransactionErrorReasonCode.Database;
            }
            case TransactionErrorReasonCode.Client: {
                return DataBaseTransactionErrorReasonCode.Client;
            }
            case TransactionErrorReasonCode.Unknown: {
                return DataBaseTransactionErrorReasonCode.Unkonwn;
            }
            default: {
                throw new Error(`Unknown transactionErrorReasonCode ${transactionErrorReasonCode}`);
            }
        }
    }

    public static errorCodeToDataBase(errorCode: ErrorCode): DataBaseErrorCode {
        switch (errorCode) {
            case ErrorCode.RequestTimeout: {
                return DataBaseErrorCode.RequestTimeout;
            }
            case ErrorCode.ClientTimeout: {
                return DataBaseErrorCode.ClientTimeout;
            }
            case ErrorCode.Unknown: {
                return DataBaseErrorCode.Unknown;
            }
            default: {
                throw new Error(`Unknown errorCode ${errorCode}`);
            }
        }
    }
}
