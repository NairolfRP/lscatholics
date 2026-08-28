import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(['test', 'development', 'production']),
    LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).optional(),
    CRON_SECRET:
      process.env.NODE_ENV === 'production' ? z.string().min(64) : z.string().min(64).optional(),
    DATABASE_URL: z.url().or(z.literal(':memory:')),
    DATABASE_AUTH_TOKEN: z.string().optional(),
    BETTER_AUTH_URL: z.url(),
    BETTER_AUTH_SECRET: z.string().min(32),
    OAUTH_PROXY_SECRET: z.string(),
    GTAW_SERVER: z.enum(['en', 'fr']).optional().default('en'),
    GTAW_OAUTH_CLIENT_ID: z.string(),
    GTAW_OAUTH_CLIENT_SECRET: z.string(),
    DISCORD_CLIENT_ID: z.string(),
    DISCORD_CLIENT_SECRET: z.string(),
    DISCORD_GUILD_ID: z.string(),
    DISCORD_BOT_TOKEN: z.string(),
    ROLEPLAY_FACTION_ID: z.coerce.number().int().positive().optional().default(563),
    ROLEPLAY_FACTION_LOWEST_LEADERSHIP_RANK: z.coerce
      .number()
      .int()
      .min(1)
      .max(15)
      .optional()
      .default(14),
    ROLEPLAY_FACTION_LOWEST_SUPERVISOR_RANK: z.coerce
      .number()
      .int()
      .min(1)
      .max(15)
      .optional()
      .default(10),
    ROLEPLAY_FACTION_MINIMAL_RANK_DASHBOARD_ACCESS: z.coerce
      .number()
      .int()
      .min(1)
      .max(15)
      .optional()
      .default(9),
    ROLEPLAY_FACTION_MINIMAL_RANK_FINANCES: z.coerce
      .number()
      .int()
      .min(1)
      .max(15)
      .optional()
      .default(12),

    CONTACT_DISCORD_WEBHOOK: z.url().optional(),
    PARISHIONER_REGISTRATION_DISCORD_WEBHOOK: z.url().optional(),
    VOLUNTEER_APPLICATION_DISCORD_WEBHOOK: z.url().optional(),
    JOB_APPLICATION_DISCORD_WEBHOOK: z.url().optional(),
    CLERGY_APPLICATION_DISCORD_WEBHOOK: z.url().optional(),
    BANKING_TRANSACTION_LOGS_DISCORD_WEBHOOK: z.url().optional(),

    FLEECA_API_KEY: z.string().optional(),
    FLEECA_BASE_URL: z.url().optional().default('https://fleeca.gta.world/api/v2'),
    PAYMENT_ENCRYPTION_KEY:
      process.env.NODE_ENV === 'production' ? z.string().min(32) : z.string().min(32).optional(),
    DONATE_PRIVATE_NOTIFICATION_WEBHOOK: z.url().optional(),
    DONATE_PUBLIC_NOTIFICATION_WEBHOOK: z.url().optional(),
    GIFT_SHOP_NOTIFICATION_WEBHOOK:
      process.env.NODE_ENV === 'production' ? z.url() : z.url().optional(),
  },

  /**
   * What object holds the environment variables at runtime. This is usually
   * `process.env` or `import.meta.env`.
   */
  runtimeEnv: process.env,

  /**
   * By default, this library will feed the environment variables directly to
   * the Zod validator.
   *
   * This means that if you have an empty string for a value that is supposed
   * to be a number (e.g. `PORT=` in a ".env" file), Zod will incorrectly flag
   * it as a type mismatch violation. Additionally, if you have an empty string
   * for a value that is supposed to be a string with a default value (e.g.
   * `DOMAIN=` in an ".env" file), the default value will never be applied.
   *
   * In order to solve these issues, we recommend that all new projects
   * explicitly specify this option as true.
   */
  emptyStringAsUndefined: true,
})
