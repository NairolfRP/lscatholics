import { drizzleAdapter } from '@better-auth/drizzle-adapter'
import { i18n } from '@better-auth/i18n'
import { gtaworld } from '@gtaw-oauth-providers/better-auth'
import { waitUntil } from '@vercel/functions'
import { APIError, createAuthMiddleware } from 'better-auth/api'
import { betterAuth } from 'better-auth/minimal'
import { admin, genericOAuth, oAuthProxy, openAPI, testUtils } from 'better-auth/plugins'
import { tanstackStartCookies } from 'better-auth/tanstack-start'
import { and, eq } from 'drizzle-orm'
import { envClient } from '#/config/env-client'
import { env } from '#/config/env.server'
import { ac, roles } from '#/shared/integrations/auth/access-control'
import { isDev, isProd, isTest } from '#/utils/environment.ts'
import { db } from '#server/db'
import * as authSchema from '#server/db/schema/auth-schema'

export const auth = betterAuth({
  appName: envClient.VITE_APP_TITLE,
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
  plugins: [
    admin({
      ac,
      roles,
    }),
    genericOAuth({
      config: [
        gtaworld({
          clientId: env.GTAW_OAUTH_CLIENT_ID,
          clientSecret: env.GTAW_OAUTH_CLIENT_SECRET,
          server: env.GTAW_SERVER,
          redirectURI: 'https://archls.infos.st/api/auth/callback/gtaw',
          overrideUserInfoOnSignIn: true,
        }),
      ],
    }),
    ...(isProd
      ? [oAuthProxy({ productionURL: 'https://archls.infos.st', secret: env.OAUTH_PROXY_SECRET })]
      : []),
    ...(isDev ? [openAPI()] : []),
    ...(isTest ? [testUtils()] : []),
    i18n({
      translations: {
        fr: {
          USER_NOT_FOUND: 'Utilisateur non trouvé',
          CREDENTIAL_ACCOUNT_NOT_FOUND: 'Aucun compte associé à ces identifiants',
          SESSION_EXPIRED: 'Session expirée',
          INVALID_CALLBACK_REQUEST: "Requête de retour d'authentification invalide",
          NO_CODE: "Code d'authentification non fourni",
          INVALID_CODE: "Code d'authentification invalide",
          INTERNAL_SERVER_ERROR: 'Une erreur interne est survenue',
          STATE_NOT_FOUND: "État d'authentification introuvable",
          STATE_INVALID: "État d'authentification invalide",
          STATE_MISMATCH: 'Échec de la vérification de sécurité',
          NO_CALLBACK_URL: "Aucune URL de retour n'a été fournie",
          OAUTH_PROVIDER_NOT_FOUND: "Fournisseur d'authentification introuvable",
          UNABLE_TO_GET_USER_INFO: "Impossible de récupérer les informations de l'utilisateur",
          UNABLE_TO_LINK_ACCOUNT: "Impossible d'associer ce compte",
          UNABLE_TO_CREATE_USER: 'Impossible de créer le compte utilisateur',
          UNABLE_TO_CREATE_SESSION: 'Impossible de créer la session',
          ACCOUNT_NOT_LINKED: "Aucun compte associé à cette méthode d'authentification",
          ACCOUNT_ALREADY_LINKED_TO_DIFFERENT_USER: 'Compte déjà associé à un autre utilisateur',
          SIGNUP_DISABLED: 'Création de compte désactivée',
        },
      },
    }),
    tanstackStartCookies(),
  ],
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
        input: false,
      },
      banExpires: {
        type: 'date',
        input: false,
      },
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days,
    updateAge: 60 * 60 * 24, // 1 day
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
      strategy: 'jwe',
      version: '1',
    },
    freshAge: 60 * 60 * 24, // 1 day
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
        before: async (accountData) => {
          const nbOfProviderAccounts = await db.$count(
            authSchema.accounts,
            and(
              eq(authSchema.accounts.userId, accountData.userId),
              eq(authSchema.accounts.providerId, accountData.providerId)
            )
          )

          if (nbOfProviderAccounts > 0) {
            throw new APIError('FORBIDDEN', {
              message: 'User can only have one account per provider',
            })
          }

          return { data: accountData }
        },
      },
    },
  },
  hooks: {
    // oxlint-disable-next-line typescript/require-await
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path === '/sign-in/social') {
        if (ctx.body?.provider !== 'gtaw') {
          throw new APIError('FORBIDDEN', {
            message: 'Only GTA World sign-in is allowed',
          })
        }
      }

      if (ctx.body?.provider === 'gtaw') {
        throw new APIError('FORBIDDEN', {
          message: 'Cannot unlink GTA World account - this is your primary authentication method',
        })
      }
    }),
  },
  telemetry: {
    enabled: false,
  },
  experimental: { joins: true },
})
