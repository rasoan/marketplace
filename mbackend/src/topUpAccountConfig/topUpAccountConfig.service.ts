'use strict';

import { Injectable } from '@nestjs/common';

import { topUpAccountConfigBackendDTO } from "./constants";
import { TopUpAccountConfigBackend } from "./TopUpAccountConfigServer/TopUpAccountConfigBackend";

@Injectable()
export class TopUpAccountConfigService {
    public readonly topUpAccountConfigBackend: TopUpAccountConfigBackend;

    constructor() {
        this.topUpAccountConfigBackend = TopUpAccountConfigBackend.fromDTO(topUpAccountConfigBackendDTO);
    }
}

