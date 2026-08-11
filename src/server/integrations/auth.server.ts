import { drizzleAdapter } from '@better-auth/drizzle-adapter'
import { waitUntil } from '@vercel/functions'
import { betterAuth } from 'better-auth/minimal'
import { envClient } from '#/config/env-client'
import { env } from '#/config/env.server'
import { isDev, isProd } from '#/utils/environment.ts'
import { db } from '#server/db'
import * as authSchema from '#server/db/schema/auth-schema'
import { AUTH_PLUGINS } from '#server/integrations/auth/plugins.ts'
import { SESSION_CONFIG } from './auth/auth.constants'
import { beforeHook, enforceOneAccountPerProvider } from './auth/hooks'

export const auth = betterAuth({
  appName: envClient.VITE_APP_TITLE,
  trustedOrigins: [
    'http://localhost:3000',
    ...(process.env.VERCEL_URL ? [`https://${process.env.VERCEL_URL}`] : []),
  ],
  database: drizzleAdapter(db, {
    schema: authSchema,
    provider: 'sqlite',
    usePlural: true,
    debugLogs: isDev,
  }),
  socialProviders: {
    discord: {
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
      disableSignUp: true,
      disableDefaultScope: true,
      scope: ['identify'],
      mapProfileToUser: (profile) => ({
        email: `${profile.id}@discord.placeholder.local`,
      }),
    },
  },
  plugins: AUTH_PLUGINS,
  user: {
    deleteUser: {
      enabled: true,
    },
    additionalFields: {
      role: {
        type: 'string',
        input: false,
      },
      banned: {
        type: 'boolean',
        input: false,
      },
      banReason: {
        type: 'string',
        required: false,
        input: false,
      },
      banExpires: {
        type: 'date',
        required: false,
        input: false,
      },
    },
  },
  session: {
    ...SESSION_CONFIG,
  },
  account: {
    accountLinking: {
      trustedProviders: ['discord'],
      allowDifferentEmails: true,
    },
    encryptOAuthTokens: true,
    storeStateStrategy: 'cookie',
  },
  verification: {
    disableCleanup: false,
    storeIdentifier: 'hashed',
  },
  advanced: {
    useSecureCookies: isProd,
    cookiePrefix: 'lscatholics',
    database: {
      generateId: 'uuid',
      joins: true,
    },
    backgroundTasks: {
      handler: waitUntil,
    },
  },
  logger: {
    disabled: !isDev,
  },
  databaseHooks: {
    account: {
      create: {
        before: enforceOneAccountPerProvider,
      },
    },
  },
  hooks: {
    before: beforeHook,
  },
  telemetry: {
    enabled: false,
  },
})
