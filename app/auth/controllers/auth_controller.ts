import type { HttpContext } from '@adonisjs/core/http'
import Account from '#users/models/account'
import User from '#users/models/user'
import { DateTime } from 'luxon'
import db from '@adonisjs/lucid/services/db'

export default class AuthController {
  async redirectToProvider({ ally, session, request }: HttpContext) {
    const intended = request.input('intended')
    if (intended) {
      session.setIntendedUrl(intended)
    }
    return ally.use('gtaw').redirect((oauthRequest) => {
      oauthRequest.param('intended', undefined)
    })
  }

  async handleCallback({ ally, auth, characters, response, session, logger }: HttpContext) {
    const gtaw = ally.use('gtaw')

    if (gtaw.accessDenied()) {
      return response.badRequest({ message: 'You have cancelled the login process' })
    }

    if (gtaw.stateMisMatch()) {
      return response.badRequest({
        message: 'We are unable to verify the request. Please try again',
      })
    }

    if (gtaw.hasError()) {
      return response.badRequest({ message: 'An error has occurred', error: gtaw.getError() })
    }

    const gtawUser = await gtaw.user()

    if (gtawUser.original.confirmed !== 1) {
      return response.unauthorized({
        message: 'Your GTA World account is not confirmed or is disabled',
      })
    }

    if (!gtawUser.original.character || gtawUser.original.character.length === 0) {
      return response.unauthorized({
        message: 'You must have at least one character on your GTA World account',
      })
    }

    try {
      const account = await Account.query()
        .where('provider_id', 'gtaw')
        .where('account_id', gtawUser.id)
        .preload('user')
        .first()

      let user: User

      if (account) {
        user = account.user

        let expiresAt: DateTime | null = null
        if (gtawUser.token.expiresAt) {
          expiresAt = DateTime.fromJSDate(gtawUser.token.expiresAt)
        }

        account.merge({
          accessToken: gtawUser.token.token,
          refreshToken: gtawUser.token.refreshToken,
          accessTokenExpiresAt: expiresAt,
        })

        await account.save()
      } else {
        user = await db.transaction(async (trx) => {
          const newUser = new User()
          newUser.name = gtawUser.name

          newUser.useTransaction(trx)
          await newUser.save()

          let expiresAt: DateTime | null = null
          if (gtawUser.token.expiresAt) {
            expiresAt = DateTime.fromJSDate(gtawUser.token.expiresAt)
          }

          await newUser.related('accounts').create({
            providerId: 'gtaw',
            accountId: gtawUser.id,
            accessToken: gtawUser.token.token,
            refreshToken: gtawUser.token.refreshToken,
            accessTokenExpiresAt: expiresAt,
          })

          return newUser
        })
      }

      const currentCharacter = gtawUser.original.character.at(0)

      await Promise.all([
        auth.use('web').login(user),
        characters.setUserCharacters(user, gtawUser.original.character),
      ])

      characters.setCurrentCharacter(currentCharacter)
    } catch (err) {
      logger.error({ err }, 'Failed to authenticate user')
      session.flash('error', "Une erreur est survenue lors de l'authentification de votre compte.")
    }

    return response.redirect().withQs(false).toIntendedRoute('home')
  }

  async redirectToDiscord({ ally }: HttpContext) {
    return ally.use('discord').redirect()
  }

  async handleDiscordCallback({ ally, response, auth, session, logger }: HttpContext) {
    try {
      const discord = ally.use('discord')

      if (discord.accessDenied()) {
        return response.badRequest({ message: 'You have cancelled the login process' })
      }

      if (discord.stateMisMatch()) {
        return response.badRequest({
          message: 'We are unable to verify the request. Please try again',
        })
      }

      if (discord.hasError()) {
        return response.badRequest({ message: 'An error has occurred', error: discord.getError() })
      }

      const discordUser = await discord.user()
      const user = auth.user!

      const userDiscordAccount = await user
        .related('accounts')
        .query()
        .where('provider_id', 'discord')
        .first()

      if (!userDiscordAccount) {
        await user.related('accounts').create({
          providerId: 'discord',
          accountId: discordUser.id,
          accessToken: discordUser.token.token,
          refreshToken: discordUser.token.refreshToken,
          accessTokenExpiresAt: DateTime.fromJSDate(discordUser.token.expiresAt),
          scope: discordUser.token.scope,
        })
        return response.redirect().toRoute('account.settings')
      }

      if (userDiscordAccount.accountId !== discordUser.id) {
        return response.unauthorized({ message: 'Other Discord account is linked' })
      }

      userDiscordAccount.merge({
        accessToken: discordUser.token.token,
        refreshToken: discordUser.token.refreshToken,
        accessTokenExpiresAt: DateTime.fromJSDate(discordUser.token.expiresAt),
        scope: discordUser.token.scope,
      })

      await userDiscordAccount.save()

      return response.redirect().toRoute('account.settings')
    } catch (err) {
      logger.error({ err }, `Failed to link discord to user ${auth.user!.id}`)
      session.flash(
        'error',
        'Une erreur est survenue lors de la connexion de votre compte Discord.'
      )
      return response.redirect().withQs(false).toRoute('account.settings')
    }
  }

  async unlinkDiscord({ auth, response, logger }: HttpContext) {
    try {
      const user = auth.user!

      const discord = await user.related('accounts').query().where('provider_id', 'discord').first()

      if (!discord) {
        throw new Error('No discord account found')
      }

      await discord.delete()

      return response.redirect().back()
    } catch (err) {
      logger.error({ err }, `Failed to unlink discord from user ${auth.user!.id}`)
      return response.redirect().back()
    }
  }

  async logout({ auth, characters, response, session, logger, request }: HttpContext) {
    const intended = request.input('intended')
    try {
      if (intended) {
        session.setIntendedUrl(intended)
      }
      await auth.use('web').logout()
      await characters.clearCurrentCharacter()
      session.flash('success', 'Déconnecté avec succès. A très bientôt !')
      return response.redirect().withQs(false).toIntendedRoute('home')
    } catch (error) {
      logger.error({ err: error }, 'Failed to logout')

      session.flash(
        'error',
        'Une erreur est survenue. Impossible de vous déconnecter. Contactez un administrateur du site ou supprimez vos cookies manuellement.'
      )

      return response.redirect().withQs(false).back()
    }
  }
}
