import { connect } from '@tursodatabase/serverless'
import { drizzle as drizzleServerless } from 'drizzle-orm/tursodatabase-serverless'
import { env } from '#/config/env.server'
import { relations } from '#server/db/relations.ts'
import { connectWithRetries } from '#server/db/turso-retry.ts'
import { logger } from '#server/integrations/logger.ts'

let db: ReturnType<typeof drizzleServerless<typeof relations>>

if (process.env.NODE_ENV === 'production') {
  const client = connectWithRetries(
    connect({
      url: env.DATABASE_URL,
      authToken: env.DATABASE_AUTH_TOKEN,
    })
  )

  db = drizzleServerless({ client, relations })
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
