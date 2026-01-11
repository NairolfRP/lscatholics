import env from '#start/env'
import { defineConfig } from '@adonisjs/lucid'
import app from '@adonisjs/core/services/app'

const dbConfig = defineConfig({
  prettyPrintDebugQueries: app.inDev,
  connection: 'sqlite',
  connections: {
    sqlite: {
      client: 'libsql',
      connection: {
        filename: env.get('TURSO_AUTH_TOKEN')
          ? `${env.get('TURSO_DATABASE_URL')}?authtoken=${env.get('TURSO_AUTH_TOKEN')}`
          : env.get('TURSO_DATABASE_URL'),
      },
      migrations: {
        naturalSort: true,
        paths: ['database/migrations'],
      },
      useNullAsDefault: true,
      debug: app.inDev,
    },
    postgres: {
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
    },
  },
})

export default dbConfig
