import { drizzle as drizzleServerless } from 'drizzle-orm/tursodatabase-serverless'
import { env } from '#/config/env.server'
import { relations } from '#server/db/relations.ts'
import { logger } from '#server/integrations/logger.ts'

let db: ReturnType<typeof drizzleServerless<typeof relations>>

if (process.env.NODE_ENV === 'production') {
  db = drizzleServerless({
    connection: {
      url: env.DATABASE_URL,
      authToken: env.DATABASE_AUTH_TOKEN,
    },
    relations,
  })
} else {
  const { drizzle } = await import('drizzle-orm/tursodatabase/database')
  db = drizzle(process.env.DATABASE_URL!, {
    relations,
    logger:
      env.NODE_ENV === 'development'
        ? {
            logQuery(query, params) {
              logger.debug({ query, params })
            },
          }
        : false,
  }) as unknown as typeof db
}

export { db }
