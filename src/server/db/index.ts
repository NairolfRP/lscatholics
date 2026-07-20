import { drizzle } from 'drizzle-orm/libsql/web'
import { env } from '#/config/env.server'
import * as schema from './schema'

export const db = drizzle({
  connection: {
    url: env.DATABASE_URL,
    authToken: env.DATABASE_AUTH_TOKEN,
  },
  schema,
  logger: env.NODE_ENV === 'development',
})
