import type Account from '#models/account'
import type { HttpContext } from '@adonisjs/core/http'
import env from '#start/env'
import { DateTime } from 'luxon'

type DiscordTokenResponse = {
  token_type: string
  access_token: string
  expires_in: number
  refresh_token: string
  scope: string
}

export class DiscordTokenService {
  static async getValidAccessToken(ctx: HttpContext, account: Account): Promise<string | null> {
    const expiresAt = account.accessTokenExpiresAt
    const needsRefresh = !expiresAt || expiresAt.diffNow('minutes').minutes < 5

    if (!needsRefresh) {
      return account.getDecryptedAccessToken()
    }

    return await this.refreshAccessToken(ctx, account)
  }

  static async refreshAccessToken(
    { logger }: HttpContext,
    account: Account
  ): Promise<string | null> {
    try {
      const refreshToken = account.getDecryptedRefreshToken()

      if (!refreshToken) {
        return null
      }

      const response = await fetch('https://discord.com/api/v10/oauth2/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: env.get('DISCORD_CLIENT_ID'),
          client_secret: env.get('DISCORD_CLIENT_SECRET'),
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
        }),
      })

      if (!response.ok) {
        if (response.status === 400) {
          return null
        }
        throw new Error(`Discord API error: ${response.status}`)
      }

      const data = (await response.json()) as DiscordTokenResponse

      account.merge({
        accessToken: data.access_token,
        accessTokenExpiresAt: DateTime.now().plus({ seconds: data.expires_in }),
        refreshToken: data.refresh_token,
        scope: data.scope,
      })

      await account.save()

      return data.access_token
    } catch (err) {
      logger.error({ err }, 'Failed to refresh Discord access token')
      return null
    }
  }
}
