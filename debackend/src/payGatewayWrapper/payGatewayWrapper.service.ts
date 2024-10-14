'use strict';

import type { IAntilopayService } from "./payGatewayInput/antilopay/types/antilopay.service";
import type {
    ITable_PayGatewayInput_Output,
    ITable_PayGatewayInputAntilopay_Output,
    ITable_PayGatewayInputPalych_Output,
    ITable_PayGatewayOutput_Output,
    ITable_PayGatewayOutputInterhub_Output,
    ITable_PayGatewayOutputInterhubCheckRequest_Output,
} from "../topUpAccount/types/topUpAccount";

import { Inject, Injectable } from "@nestjs/common";
import { Pool } from "pg";

import { PayGatewayInputType, PayGatewayOutputType } from "@deshopfrontend/src/utils/topUpAccount/constants";
import { assertIsDefined } from "@detools/type_guards/base";

import { TopUpAccountConfigService } from "../topUpAccountConfig/topUpAccountConfig.service";
import { InterhubService } from "./payGatewayOutput/interhub/interhub.service";
import { PalychService } from "./payGatewayInput/palych/palych.service";
import { AntilopayService } from "./payGatewayInput/antilopay/antilopay.service";
import { EventEmitterWrapperService} from "../eventEmitterWrapper/eventEmitterWrapper.service";
import { IBaseHttpPalych } from "../baseHttp/types/baseHttpPalych";
import { IPayGatewayWrapper } from "./types/payGatewayWrapper";
import { pgQueryAndNormaliseResponse, SqlRequestsGetter } from "../topUpAccount/utils/sqlRequsts";
import { DATABASE_POOL } from "../database/database.module";
import {
    Table_PayGatewayOutput_Columns,
    Table_PayGatewayOutputInterhub_Columns,
    TableNames,
} from "../topUpAccount/utils/types/sqlRequests";

@Injectable()
export class PayGatewayWrapperService {
    @Inject(DATABASE_POOL)
    private readonly _pool: Pool;
    @Inject(TopUpAccountConfigService)
    private _topUpAccountConfigService: TopUpAccountConfigService;

    @Inject(PalychService)
    private _palychService: PalychService;
    @Inject(AntilopayService)
    private _antilopayService: AntilopayService;
    @Inject(EventEmitterWrapperService)
    private _eventEmitterWrapperService: EventEmitterWrapperService;

    constructor(
        private _interhubService: InterhubService
    ) {
    }

    public async savePay(options: IPayGatewayWrapper.SavePayMethodOptions) {
        const {
            transactionId,
            amount,
            serviceLocalId,
            account,
        } = options;
        const {
            payGatewayOutputType,
        } = this._topUpAccountConfigService.topUpAccountConfigBackend.topUpAccountConfig;

        const table_PayGatewayOutput_Output = await this._create_table_PayGatewayOutput_Output(transactionId);

        switch (payGatewayOutputType) {
            case PayGatewayOutputType.Interhub: {
                const table_PayGatewayOutputInterhub_Output = await createPayGatewayOutputSpecific<ITable_PayGatewayOutputInterhub_Output>({
                    table_PayGatewayOutput_id: table_PayGatewayOutput_Output.id,
                    pool: this._pool,
                    payGatewayOutputType: PayGatewayOutputType.Interhub,
                });

                return this._interhubService.saveCheckRequest({
                    payGatewayOutputInterhubId: table_PayGatewayOutputInterhub_Output.id,
                    amount,
                    serviceLocalId,
                    account,
                });
            }
            default: {
                throw new Error(`Unknown payGatewayOutputType type ${payGatewayOutputType}`);
            }
        }
    }

    public async _create_table_PayGatewayOutput_Output(transactionId: number): Promise<ITable_PayGatewayOutput_Output> {
        let table_PayGatewayOutput_Output: ITable_PayGatewayOutput_Output | undefined = void 0;

        {
            const {
                sqlRequest: payGatewayOutput_sqlRequest,
                values: payGatewayOutput_sqlRequestValues,
            } = SqlRequestsGetter.create__payGatewayOutput({
                shop_transaction_id: transactionId,
            });

            table_PayGatewayOutput_Output = await pgQueryAndNormaliseResponse<ITable_PayGatewayInput_Output>(
                this._pool,
                payGatewayOutput_sqlRequest,
                payGatewayOutput_sqlRequestValues,
            );

            assertIsDefined(table_PayGatewayOutput_Output, "table_PayGatewayOutput_Output is not defined!");
        }

        return table_PayGatewayOutput_Output;
    }

    public async _create_table_PayGatewayInput_Output(transactionId: number): Promise<ITable_PayGatewayInput_Output> {
        let table_PayGatewayInput_Output: ITable_PayGatewayInput_Output | undefined = void 0;

        {
            const {
                sqlRequest: payGatewayInput_sqlRequest,
                values: payGatewayInput_sqlRequestValues,
            } = SqlRequestsGetter.create__payGatewayInput({
                shop_transaction_id: transactionId,
            });

            table_PayGatewayInput_Output = await pgQueryAndNormaliseResponse<ITable_PayGatewayInput_Output>(
                this._pool,
                payGatewayInput_sqlRequest,
                payGatewayInput_sqlRequestValues,
            );

            assertIsDefined(table_PayGatewayInput_Output, "table_PayGatewayInput_Output is not defined!");
        }

        return table_PayGatewayInput_Output;
    }

    public async createBill(options: IPayGatewayWrapper.CreateBillMethodOptions): Promise<{
        linkPagePay: string,
        linkPagePayWithQRCode: string,
        billId: string,
    }> {
        const {
            amount,
            transactionId,
            clientEmail,
        } = options;
        const {
            payGatewayInputType,
        } = this._topUpAccountConfigService.topUpAccountConfigBackend.topUpAccountConfig;

        const table_PayGatewayInput_Output = await this._create_table_PayGatewayInput_Output(transactionId);

        switch (payGatewayInputType) {
            case PayGatewayInputType.Palych: {
                const table_PayGatewayInputPalych_Output = await createPayGatewayInputSpecific<ITable_PayGatewayInputPalych_Output>({
                    table_PayGatewayInput_id: table_PayGatewayInput_Output.id,
                    pool: this._pool,
                    payGatewayInputType: PayGatewayInputType.Palych,
                });

                return this._palychService.createBill({
                    payGatewayInputPalychId: table_PayGatewayInputPalych_Output.id,
                    amount,
                });
            }
            case PayGatewayInputType.Antilopay: {
                const table_PayGatewayInputAntilopay_Output = await createPayGatewayInputSpecific<ITable_PayGatewayInputAntilopay_Output>({
                    table_PayGatewayInput_id: table_PayGatewayInput_Output.id,
                    pool: this._pool,
                    payGatewayInputType: PayGatewayInputType.Antilopay,
                });

                return this._antilopayService.createBill({
                    payGatewayInputAntilopayId: table_PayGatewayInputAntilopay_Output.id,
                    amount,
                    customer: {
                        email: clientEmail,
                    },
                // todo: здесь подставить потом настоящее
                }) as any;
            }
            default: {
                throw new Error(`Unknown payGateway Input type ${payGatewayInputType}`);
            }
        }
    }

    // todo: это прибито к interhub : Promise<ITable_PayGatewayOutputInterhubCheckRequestData_Output>, возвращать надо что-то универсальное
    public async pay(options: IPayGatewayWrapper.PayMethodOptions): Promise<ITable_PayGatewayOutputInterhubCheckRequest_Output> {
        const {
            transactionId,
        } = options;
        const {
            payGatewayOutputType,
        } = this._topUpAccountConfigService.topUpAccountConfigBackend.topUpAccountConfig;

        const {
            sqlRequest: find_table_PayGatewayOutput_Output_sqlRequest,
            values: find_table_PayGatewayOutput_Output_sqlRequestValues,
        } = SqlRequestsGetter.findOne(TableNames.PayGatewayOutput, {
            where: {
                value: transactionId,
                name: Table_PayGatewayOutput_Columns.ShopTransactionId,
            },
        });

        const table_PayGatewayOutput_Output = await pgQueryAndNormaliseResponse<ITable_PayGatewayOutput_Output>(
            this._pool,
            find_table_PayGatewayOutput_Output_sqlRequest,
            find_table_PayGatewayOutput_Output_sqlRequestValues,
        );

        assertIsDefined(table_PayGatewayOutput_Output, `No table_ITable_PayGatewayOutput_Output ${table_PayGatewayOutput_Output}`);

        switch (payGatewayOutputType) {
            case PayGatewayOutputType.Interhub: {
                const {
                    sqlRequest: find_table_PayGatewayOutputInterhub_Output_sqlRequest,
                    values: find_table_PayGatewayOutputInterhub_Output_sqlRequestValues,
                } = SqlRequestsGetter.findOne(TableNames.PayGatewayOutputInterhub, {
                    where: {
                        value: table_PayGatewayOutput_Output.id,
                        name: Table_PayGatewayOutputInterhub_Columns.PayGatewayOutputId,
                    },
                });

                const table_ITable_PayGatewayOutputInterhub_Output = await pgQueryAndNormaliseResponse<ITable_PayGatewayOutputInterhub_Output>(
                    this._pool,
                    find_table_PayGatewayOutputInterhub_Output_sqlRequest,
                    find_table_PayGatewayOutputInterhub_Output_sqlRequestValues,
                );

                assertIsDefined(table_ITable_PayGatewayOutputInterhub_Output, `No table_ITable_PayGatewayOutput_Output ${table_PayGatewayOutput_Output}`);

                return this._interhubService.pay({
                    payGatewayOutputInterhubId: table_ITable_PayGatewayOutputInterhub_Output.id,
                });
            }
            default: {
                throw new Error(`Unkknown payGatewayOutputType ${payGatewayOutputType}`);
            }
        }
    }

    public async postbackNotificationPalych(postbackData: IBaseHttpPalych.PostbackPaymentNotificationData) {
        const payGatewayInputType = PayGatewayInputType.Palych;

        if (this._topUpAccountConfigService.topUpAccountConfigBackend.topUpAccountConfig.payGatewayInputType !== payGatewayInputType) {
            throw new Error("Invalid PayGateway Input!");
        }

        const {
            transactionId,
            billId,
            amount,
        } = await this._palychService.onPostbackNotification(postbackData);

        this._eventEmitterWrapperService.payGatewayInputEventEmitterWrapper.emitSuccessPay({
            eventData: {
                payGatewayInputType,
                transactionId,
                billId,
                amount,
            },
        });
    }

    public async postbackNotificationAntilopay(postbackData: IAntilopayService.PostbackNotificationOptions) {
        const payGatewayInputType = PayGatewayInputType.Antilopay;

        if (this._topUpAccountConfigService.topUpAccountConfigBackend.topUpAccountConfig.payGatewayInputType !== payGatewayInputType) {
            throw new Error("Invalid PayGateway Input!");
        }

        const {
            transactionId,
            billId,
            amount,
        } = await this._antilopayService.onPostbackNotification(postbackData);

        this._eventEmitterWrapperService.payGatewayInputEventEmitterWrapper.emitSuccessPay({
            eventData: {
                payGatewayInputType,
                transactionId,
                billId,
                amount,
            },
        });
    }
}

async function createPayGatewayInputSpecific<T = ITable_PayGatewayInputAntilopay_Output | ITable_PayGatewayInputPalych_Output>(options: {
    table_PayGatewayInput_id: number,
    pool: Pool,
    payGatewayInputType: PayGatewayInputType,
}): Promise<T> {
    const {
        table_PayGatewayInput_id,
        payGatewayInputType,
        pool,
    } = options;
    let result: { sqlRequest: string, values: [number] };

    switch (payGatewayInputType) {
        case PayGatewayInputType.Palych: {
            result = SqlRequestsGetter.create__payGatewayInputPalych({
                pay_gateway_input_id: table_PayGatewayInput_id,
            });

            break;
        }
        case PayGatewayInputType.Antilopay: {
            result = SqlRequestsGetter.create__payGatewayInputAntilopay({
                pay_gateway_input_id: table_PayGatewayInput_id,
            });

            break;
        }
        default: {
            throw new Error(`Invalid PayGateway Input! ${payGatewayInputType}`);
        }
    }

    const {
        sqlRequest: payGatewayInputSpecific_sqlRequest,
        values: payGatewayInputSpecific_sqlRequestValues,
    } = result;

    const table_PayGatewayInputSpecific_Output = await pgQueryAndNormaliseResponse<T>(
        pool,
        payGatewayInputSpecific_sqlRequest,
        payGatewayInputSpecific_sqlRequestValues,
    );

    assertIsDefined(table_PayGatewayInputSpecific_Output, "table_PayGatewayInputSpecific_Output is not defined!");

    return table_PayGatewayInputSpecific_Output;
}

async function createPayGatewayOutputSpecific<T = ITable_PayGatewayOutputInterhub_Output>(options: {
    table_PayGatewayOutput_id: number,
    pool: Pool,
    payGatewayOutputType: PayGatewayOutputType,
}): Promise<T> {
    const {
        table_PayGatewayOutput_id,
        payGatewayOutputType,
        pool,
    } = options;

    let result: { sqlRequest: string, values: [number] };

    switch (payGatewayOutputType) {
        case PayGatewayOutputType.Interhub: {
            result = SqlRequestsGetter.create__payGatewayOutputInterhub({
                pay_gateway_output_id: table_PayGatewayOutput_id,
            });

            break;
        }
        default: {
            throw new Error(`Invalid PayGateway Input! ${payGatewayOutputType}`);
        }
    }

    const {
        sqlRequest: payGatewayOutputSpecific_sqlRequest,
        values: payGatewayOutputSpecific_sqlRequestValues,
    } = result;

    const table_PayGatewayOutputSpecific_Output = await pgQueryAndNormaliseResponse<T>(
        pool,
        payGatewayOutputSpecific_sqlRequest,
        payGatewayOutputSpecific_sqlRequestValues,
    );

    assertIsDefined(table_PayGatewayOutputSpecific_Output, "table_PayGatewayOutputSpecific_Output is not defined!");

    return table_PayGatewayOutputSpecific_Output;
}
