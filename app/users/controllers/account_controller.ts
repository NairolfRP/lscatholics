import type { HttpContext } from '@adonisjs/core/http'
import { DiscordTokenService } from '#discord/services/discord_token_service'
import { inject } from '@adonisjs/core'
import { createDeleteUserConfirmationValidator } from '#users/validators/delete_user_confirmation'

@inject()
export default class AccountController {
  constructor(protected discordTokenService: DiscordTokenService) {}

  async edit(ctx: HttpContext) {
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

      return inertia.render('account/settings', {
        discordUser,
      })
    } catch (err) {
      logger.error({ err }, 'An error occured on account controller')
      return inertia.render('account/settings', {
        discordUser: null,
      })
    }
  }

  async delete({ auth, characters, request, response, session, logger }: HttpContext) {
    const user = auth.user!

    await request.validateUsing(createDeleteUserConfirmationValidator(user.name))

    try {
      await user.delete()

      await auth.use('web').logout()
      await characters.clearCurrentCharacter()

      session.flash('success', {
        message:
          'Votre compte et ses données associées ont définitivement été supprimées avec succès.',
      })

      return response.redirect('/')
    } catch (error) {
      logger.error({ err: error, user: user }, 'Failed to delete account')
      session.flashErrors({
        E_DELETE_USER:
          "Une erreur s'est produite lors de la suppression du compte. Contactez un administrateur du site.",
      })
      return response.redirect().back()
    }
  }
}
