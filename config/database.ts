import env from '#start/env'
import { defineConfig } from '@adonisjs/lucid'
import app from '@adonisjs/core/services/app'

const tursoUrl = env.get('TURSO_DATABASE_URL')
const tursoToken = env.get('TURSO_AUTH_TOKEN')

const getTursoConnectionString = () => {
  if (!tursoToken) {
    return tursoUrl
  }

  if (
    tursoUrl.startsWith('libsql://') ||
    tursoUrl.startsWith('wss://') ||
    tursoUrl.startsWith('https://')
  ) {
    return `${tursoUrl}?authToken=${tursoToken}`
  }

  return tursoUrl
}

const dbConfig = defineConfig({
  prettyPrintDebugQueries: app.inDev,
  connection: 'sqlite',
  connections: {
    sqlite: {
      client: 'libsql',
      connection: {
        filename: getTursoConnectionString(),
        debug: app.inDev,
      },
      pool: {
        afterCreate: (conn: any, done: any) => {
          conn.run('PRAGMA busy_timeout = 5000;')
          done()
        },
        min: 1,
        max: 10,
        acquireTimeoutMillis: 30000,
        createTimeoutMillis: 30000,
        idleTimeoutMillis: 10000,
        reapIntervalMillis: 1000,
        createRetryIntervalMillis: 200,
        propagateCreateError: true,
      },
      migrations: {
        naturalSort: true,
        paths: ['database/migrations'],
      },
      useNullAsDefault: true,
      debug: app.inDev,
    },
    /*postgres: {
      client: 'pg',
      connection: {
        host: env.get('DB_HOST'),
        port: env.get('DB_PORT'),
        user: env.get('DB_USER'),
        password: env.get('DB_PASSWORD'),
        database: env.get('DB_DATABASE'),
        ssl: app.inProduction,
      },
      migrations: {
        naturalSort: true,
        paths: ['database/migrations'],
      },
      debug: app.inDev,
    },*/
  },
})

export default dbConfig
