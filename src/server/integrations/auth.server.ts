import { drizzleAdapter } from '@better-auth/drizzle-adapter'
import { i18n } from '@better-auth/i18n'
import { gtaworld } from '@gtaw-oauth-providers/better-auth'
import { waitUntil } from '@vercel/functions'
import { APIError, createAuthMiddleware, getSessionFromCtx } from 'better-auth/api'
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
  plugins: [
    oAuthProxy({
      productionURL: 'https://lscatholics.vercel.app',
      secret: env.OAUTH_PROXY_SECRET,
    }),
    admin({
      ac,
      roles,
      bannedUserMessage:
        "Vous avez été banni de l'application. Contactez @nairolf.rp sur Discord si vous pensez qu'il s'agit d'une erreur.",
    }),
    genericOAuth({
      config: [
        gtaworld({
          clientId: env.GTAW_OAUTH_CLIENT_ID,
          clientSecret: env.GTAW_OAUTH_CLIENT_SECRET,
          server: env.GTAW_SERVER,
          redirectURI: 'https://lscatholics.vercel.app/api/auth/callback/gtaw',
          overrideUserInfo: true,
        }),
      ],
    }),
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
        before: async (accountData) => {
          const nbOfProviderAccounts = await db.$count(
            authSchema.accounts,
            and(
              eq(authSchema.accounts.userId, accountData.userId),
              eq(authSchema.accounts.providerId, accountData.providerId)
            )
          )

          if (nbOfProviderAccounts > 0) {
            throw APIError.from('FORBIDDEN', {
              code: 'ONE_ACCOUNT_PER_SOCIAL_PROVIDER',
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
          throw APIError.from('FORBIDDEN', {
            code: 'FORBIDDEN_SIGN_IN_PROVIDER',
            message: 'Only GTA World sign-in is allowed',
          })
        }
      }

      if (ctx.path === '/unlink-account') {
        const session = await getSessionFromCtx(ctx)
        if (!session?.session) {
          throw APIError.from('UNAUTHORIZED', { code: 'UNAUTHORIZED', message: 'Unauthorized' })
        }

        const { accountId } = ctx.body
        const accounts = await ctx.context.internalAdapter.findAccounts(session.user.id)

        if (accounts.length > 0) {
          const isGTAWAccount = accounts.find(
            (account) => account.id === accountId && account.providerId === 'gtaw'
          )

          if (isGTAWAccount) {
            throw APIError.from('FORBIDDEN', {
              code: 'CANT_UNLINK_GTAW_ACCOUNT',
              message:
                'Cannot unlink GTA World account - this is your primary authentication method',
            })
          }
        }
      }
    }),
  },
  telemetry: {
    enabled: false,
  },
})
