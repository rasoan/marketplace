import { Module } from '@nestjs/common';
import { Pool } from 'pg';

export const DATABASE_POOL = 'DATABASE_POOL';

@Module({
    providers: [
        {
            provide: DATABASE_POOL,
            useFactory: () => {
                return new Pool({
                    host: process.env.PG_HOST,
                    database: process.env.POSTGRES_DB,
                    user: process.env.POSTGRES_USER,
                    password: process.env.POSTGRES_PASSWORD,
                    port: process.env.PG_INTERNAL_PORT as unknown as number,
                });
            },
        },
    ],
    exports: [ DATABASE_POOL ],
})
export class DatabaseModule {}
