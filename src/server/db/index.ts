import { drizzle } from 'drizzle-orm/libsql'
import { env } from '#/config/env.server'
import { relations } from '#server/db/relations.ts'
import { logger } from '#server/integrations/logger.ts'

const db = drizzle({
  connection: {
    url: env.DATABASE_URL,
    authToken: env.DATABASE_AUTH_TOKEN,
  },
  relations,
  logger:
    env.NODE_ENV === 'development'
      ? {
          logQuery(query, params) {
            logger.debug({ query, params })
          },
        }
      : false,
})

export { db }
