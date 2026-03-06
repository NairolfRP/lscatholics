import type { HttpContext } from '@adonisjs/core/http'
import { DiscordTokenService } from '#discord/services/discord_token_service'
import { inject } from '@adonisjs/core'

@inject()
export default class ProfileController {
  constructor(protected discordTokenService: DiscordTokenService) {}

  async show(ctx: HttpContext) {
    const { inertia, auth, ally, logger } = ctx

    try {
      const user = auth.user!

      const discordAccount = await user
        .related('accounts')
        .query()
        .where('providerId', 'discord')
        .first()

      let discordUser = null

      if (discordAccount) {
        try {
          const accessToken = await this.discordTokenService.getValidAccessToken(
            ctx,
            discordAccount
          )

          if (accessToken) {
            const allyUser = await ally.use('discord').userFromToken(accessToken)
            discordUser = {
              id: discordAccount.accountId,
              username: allyUser.nickName,
              avatar: allyUser.avatarUrl,
            }
          } else {
            logger.warn(
              { userId: user.id, accountId: discordAccount.id },
              'Discord token expired and could not be refreshed'
            )

            await discordAccount.delete()

            discordUser = null
          }
        } catch (err) {
          logger.error(
            {
              err,
              userId: user?.id,
              discordAccountId: discordAccount?.id,
              context: 'discord_user_fetch',
            },
            'Failed to fetch Discord user info'
          )
        }
      }

      return inertia.render('profile', {
        discordUser,
      })
    } catch (err) {
      logger.error({ err }, 'An error occured on profile controller')
      return inertia.render('profile', {
        discordUser: null,
      })
    }
  }
}
