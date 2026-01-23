import env from '#start/env'
import { defineConfig } from '@adonisjs/lucid'
import app from '@adonisjs/core/services/app'
import type { LibSQLConfig, SqliteConfig } from '@adonisjs/lucid/types/database'

const tursoUrl = env.get('TURSO_DATABASE_URL')
const tursoToken = env.get('TURSO_AUTH_TOKEN')

const sharedConfig: Partial<SqliteConfig | LibSQLConfig> = {
  migrations: {
    naturalSort: true,
    paths: ['database/migrations'],
  },
  useNullAsDefault: true,
}

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
  connection: app.inTest ? 'test' : 'default',
  connections: {
    default: {
      ...sharedConfig,
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
      debug: app.inDev,
    },
    test: {
      ...sharedConfig,
      client: 'better-sqlite3',
      connection: {
        filename: env.get('TURSO_DATABASE_URL', app.tmpPath('test.db')),
        debug: app.inTest,
      },
      pool: {
        afterCreate: (conn: any, done: any) => {
          conn.exec('PRAGMA busy_timeout = 5000;')
          done()
        },
        min: 1,
        max: 10,
      },
      debug: app.inTest,
    },
  },
})

export default dbConfig
