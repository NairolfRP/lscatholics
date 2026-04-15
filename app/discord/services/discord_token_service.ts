import type Account from '#users/models/account'
import type { HttpContext } from '@adonisjs/core/http'
import env from '#start/env'
import { DateTime } from 'luxon'
import ky, { isHTTPError } from 'ky'

type DiscordTokenResponse = {
  token_type: string
  access_token: string
  expires_in: number
  refresh_token: string
  scope: string
}

export class DiscordTokenService {
  async getValidAccessToken(ctx: HttpContext, account: Account): Promise<string | null> {
    const expiresAt = account.accessTokenExpiresAt
    const needsRefresh = !expiresAt || expiresAt.diffNow('minutes').minutes < 5

    if (!needsRefresh) {
      return account.getDecryptedAccessToken()
    }

    return await this.refreshAccessToken(ctx, account)
  }

  async refreshAccessToken({ logger }: HttpContext, account: Account): Promise<string | null> {
    try {
      const refreshToken = account.getDecryptedRefreshToken()

      if (!refreshToken) {
        return null
      }

      try {
        const response = await ky.post('https://discord.com/api/v10/oauth2/token', {
          json: {
            client_id: env.get('DISCORD_CLIENT_ID'),
            client_secret: env.get('DISCORD_CLIENT_SECRET'),
            grant_type: 'refresh_token',
            refresh_token: refreshToken,
          },
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        })

        const data = await response.json<DiscordTokenResponse>()

        account.merge({
          accessToken: data.access_token,
          accessTokenExpiresAt: DateTime.now().plus({ seconds: data.expires_in }),
          refreshToken: data.refresh_token,
          scope: data.scope,
        })

        await account.save()

        return data.access_token
      } catch (error) {
        if (isHTTPError(error)) {
          if (error.response.status === 400) return null

          throw new Error(`Discord API error: ${error.response.status}`)
        }
        throw error
      }
    } catch (err) {
      logger.error({ err }, 'Failed to refresh Discord access token')
      return null
    }
  }
}
