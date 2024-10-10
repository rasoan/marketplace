// Серверные компоненты смогут работать с process.env, нужно лишь import "*.next.config.js"
'use strict';

import { loadEnvConfig } from '@next/env';

const projectDir = process.cwd();

loadEnvConfig(projectDir);
