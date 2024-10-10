'use strict';

import { Module } from '@nestjs/common';
import { UserResolver } from './user.resolver';
import { UserService } from "./user.service";
import { DatabaseModule } from "../database/database.module";

@Module({
        imports: [DatabaseModule],
        providers: [ UserResolver, UserService, DatabaseModule ],
    },
)
export class UserModule {}
