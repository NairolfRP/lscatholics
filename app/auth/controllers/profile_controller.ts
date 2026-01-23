import type { HttpContext } from '@adonisjs/core/http'
import { DiscordTokenService } from '#auth/services/discord_token_service'

export default class ProfileController {
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
          const accessToken = await DiscordTokenService.getValidAccessToken(ctx, discordAccount)

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
