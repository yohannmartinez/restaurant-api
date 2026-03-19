import 'dotenv/config';

import path from 'node:path';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: path.join('src', 'app', 'infrastructure', 'prisma', 'schema'),
  migrations: {
    path: 'src/app/infrastructure/prisma/migrations',
  },
  datasource: {
    url: env('DATABASE_URL'),
  },
});
