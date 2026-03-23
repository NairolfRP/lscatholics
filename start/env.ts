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
import app from '@adonisjs/core/services/app'

export default await Env.create(new URL('../', import.meta.url), {
  NODE_ENV: Env.schema.enum(['development', 'production', 'test'] as const),
  PORT: Env.schema.number.optional(),
  APP_KEY: Env.schema.secret(),
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
  TURSO_DATABASE_URL: Env.schema.string(),
  TURSO_AUTH_TOKEN: Env.schema.string.optional(),

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
  | Variables for configuring GTAW faction
  |----------------------------------------------------------
  */
  GTAW_FACTION_ID: Env.schema.number.optional(),
  LOWEST_FACTION_LEADERSHIP_RANK: Env.schema.number.optional(),
  LOWEST_FACTION_SUPERVISOR_RANK: Env.schema.number.optional(),
  MINIMAL_FACTION_RANK_DASHBOARD_ACCESS: Env.schema.number.optional(),

  /*
  |----------------------------------------------------------
  | Variables for discord webhook
  |----------------------------------------------------------
  */
  DISCORD_CONTACT_WEBHOOK: Env.schema.string.optional(),
  DISCORD_CONTACT_WEBHOOK_TAG_ID: Env.schema.string.optional(),

  DONATE_PRIVATE_NOTIFICATION_WEBHOOK: Env.schema.string.optional(),
  DONATE_PUBLIC_NOTIFICATION_WEBHOOK: Env.schema.string.optional(),

  DISCORD_PARISHIONER_REGISTRATION: Env.schema.string.optional(),

  DISCORD_EMPLOYMENT_APPLICATION_WEBHOOK: Env.schema.string.optional(),

  ERROR_REPORTING_WEBHOOK: Env.schema.string.optionalWhen(!app.inProduction),
})
