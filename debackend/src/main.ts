'use strict';

import 'source-map-support/register';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const module: any;

(async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);
    const port = configService.get<number>('NEXT_PUBLIC_BACKEND_INTERNAL_PORT');

    if (typeof port === "undefined") {
        throw new Error("Port must be a positive integer");
    }

    await app.listen(port);

    if (module.hot) {
        module.hot.accept();
        module.hot.dispose(() => app.close());
    }
})();

