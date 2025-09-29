/*
|--------------------------------------------------------------------------
| Environment variables service
|--------------------------------------------------------------------------
|
| The `Env.create` method creates an instance of the Env service. The
| service validates the environment variables and also cast values
| to JavaScript data types.
|
*/

import { Env } from '@adonisjs/core/env'

export default await Env.create(new URL('../', import.meta.url), {
  NODE_ENV: Env.schema.enum.optional(['development', 'production', 'test'] as const),
  PORT: Env.schema.number.optional(),
  APP_KEY: Env.schema.string(),
  HOST: Env.schema.string.optional({ format: 'host' }),
  LOG_LEVEL: Env.schema.string(),

  /*
  |----------------------------------------------------------
  | Variables for configuring session package
  |----------------------------------------------------------
  */
  SESSION_DRIVER: Env.schema.enum(['cookie', 'memory'] as const),

  /*
  |----------------------------------------------------------
  | Variables for configuring database connection
  |----------------------------------------------------------
  */
  DB_HOST: Env.schema.string({ format: 'host' }),
  DB_PORT: Env.schema.number(),
  DB_USER: Env.schema.string(),
  DB_PASSWORD: Env.schema.string.optional(),
  DB_DATABASE: Env.schema.string(),

  /*
  |----------------------------------------------------------
  | Variables for configuring ally package
  |----------------------------------------------------------
  */
  DISCORD_CLIENT_ID: Env.schema.string(),
  DISCORD_CLIENT_SECRET: Env.schema.string(),
  DISCORD_GUILD_ID: Env.schema.string.optional(),
  DISCORD_BOT_TOKEN: Env.schema.string.optional(),

  /*
  |----------------------------------------------------------
  | Variables for configuring GTA World API
  |----------------------------------------------------------
  */
  GTAW_CLIENT_ID: Env.schema.string(),
  GTAW_CLIENT_SECRET: Env.schema.string(),
  GTAW_FLEECA_AUTH_KEY: Env.schema.string(),

  /*
  |----------------------------------------------------------
  | Variables for discord webhook
  |----------------------------------------------------------
  */
  DISCORD_CONTACT_WEBHOOK: Env.schema.string.optional(),
  DISCORD_CONTACT_WEBHOOK_TAG_ID: Env.schema.string.optional(),
  DONATE_PRIVATE_NOTIFICATION_WEBHOOK: Env.schema.string.optional(),
  DONATE_PUBLIC_NOTIFICATION_WEBHOOK: Env.schema.string.optional(),
})
