import type { BetterAuthPlugin } from 'better-auth'
import { i18n } from '@better-auth/i18n'
import { gtaworld } from '@gtaw-oauth-providers/better-auth'
import { admin, genericOAuth, oAuthProxy, openAPI, testUtils } from 'better-auth/plugins'
import { tanstackStartCookies } from 'better-auth/tanstack-start'
import { APP_PRODUCTION_URL } from '#/config/app.constants.ts'
import { env } from '#/config/env.server.ts'
import { isDev, isTest } from '#/utils/environment.ts'
import { GTAW_REDIRECT_URI } from '#server/integrations/auth/auth.constants.ts'
import { frTranslations } from '#server/integrations/auth/translations.ts'
import { ac, roles } from '#shared/integrations/auth/access-control.ts'

export const AUTH_PLUGINS = [
  oAuthProxy({
    productionURL: APP_PRODUCTION_URL,
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
        redirectURI: GTAW_REDIRECT_URI,
        overrideUserInfo: true,
      }),
    ],
  }),
  ...(isDev ? [openAPI()] : []),
  ...(isTest ? [testUtils()] : []),
  i18n({
    translations: {
      fr: frTranslations,
    },
  }),
  tanstackStartCookies(),
] satisfies BetterAuthPlugin[]
