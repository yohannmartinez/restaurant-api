import 'dotenv/config';

import path from 'node:path';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: path.join('src', 'common', 'prisma', 'schema'),
  migrations: {
    path: 'src/common/prisma/migrations',
  },
  datasource: {
    url: env('DATABASE_URL'),
  },
});
