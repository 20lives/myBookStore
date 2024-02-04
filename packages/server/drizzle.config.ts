import type { Config } from 'drizzle-kit';
import 'dotenv/config'

export default {
  schema: './db/schema.ts',
  driver: 'mysql2',
  out: './drizzle',
  dbCredentials: {
    uri: process.env.DATABASE_URL as string,
  },
} satisfies Config;
