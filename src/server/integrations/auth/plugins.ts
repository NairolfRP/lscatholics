import type { BetterAuthPlugin } from 'better-auth'
import { i18n } from '@better-auth/i18n'
import { gtaworld } from '@gtaw-oauth-providers/better-auth'
import { createAuthMiddleware } from 'better-auth/api'
import { splitSetCookieHeader } from 'better-auth/cookies'
import { admin, genericOAuth, oAuthProxy, openAPI, testUtils } from 'better-auth/plugins'
import { tanstackStartCookies } from 'better-auth/tanstack-start'
import { APP_PRODUCTION_URL } from '#/config/app.constants.ts'
import { env } from '#/config/env.server.ts'
import { isDev, isTest } from '#/utils/environment.ts'
import { GTAW_REDIRECT_URI } from '#server/integrations/auth/auth.constants.ts'
import { frTranslations } from '#server/integrations/auth/translations.ts'
import { logger } from '#server/integrations/logger.ts'
import { ac, roles } from '#shared/integrations/auth/access-control.ts'

/**
 * Plugin to change SameSite=Lax cookies to SameSite=None only for requests originating from FiveM NUI (CitizenFX User Agent)
 */
export const fiveMCookiePlugin = () =>
  ({
    id: 'fivem-cookie',
    hooks: {
      after: [
        {
          matcher(ctx) {
            return ctx.request?.headers.get('user-agent')?.includes('CitizenFX') ?? false
          },
          // oxlint-disable-next-line typescript/require-await
          handler: createAuthMiddleware(async (ctx) => {
            const responseHeaders = ctx.context.responseHeaders
            if (!responseHeaders) return

            let originalCookies: string[] = []
            let cookiesReplaced = false

            try {
              originalCookies =
                typeof responseHeaders.getSetCookie === 'function'
                  ? responseHeaders.getSetCookie()
                  : splitSetCookieHeader(responseHeaders.get('set-cookie') ?? '')

              if (originalCookies.length === 0) return

              const modifiedCookies = originalCookies.map((cookie) =>
                cookie.replace(/;\s*SameSite=Lax(?=;|$)/i, '; SameSite=None')
              )

              responseHeaders.delete('set-cookie')
              cookiesReplaced = true

              for (const cookie of modifiedCookies) {
                responseHeaders.append('set-cookie', cookie)
              }
            } catch (err) {
              if (cookiesReplaced) {
                try {
                  responseHeaders.delete('set-cookie')

                  for (const cookie of originalCookies) {
                    responseHeaders.append('set-cookie', cookie)
                  }
                } catch (restoreErr) {
                  logger.error(
                    { err, restoreErr },
                    'Failed to restore Better-Auth cookies after FiveM NUI cookie update failure'
                  )
                  return
                }
              }

              logger.error({ err }, 'Failed to update Better-Auth cookies for FiveM NUI')
            }
          }),
        },
      ],
    },
  }) satisfies BetterAuthPlugin

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
  fiveMCookiePlugin(),
  tanstackStartCookies(),
] satisfies BetterAuthPlugin[]
