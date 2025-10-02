import type { HttpContext } from '@adonisjs/core/http'
import Account from '#auth/models/account'
import User from '#auth/models/user'
import { DateTime } from 'luxon'
import db from '@adonisjs/lucid/services/db'
import { createDeleteUserConfirmationValidator } from '#auth/validators/delete_user_confirmation'

export default class AuthController {
  async redirectToProvider({ ally }: HttpContext) {
    return ally.use('gtaw').redirect()
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

      characters.setCurrentCharacter(currentCharacter)

      await auth.use('web').login(user)

      await characters.setUserCharacters(user, gtawUser.original.character)
    } catch (err) {
      logger.error({ err }, 'Failed to authenticate user')
      session.flashErrors({
        E_AUTHENTIFICATION_FAILED:
          "Une erreur est survenue lors de l'authentification de votre compte.",
      })
    } finally {
      response.redirect().back()
    }
  }

  async logout({ auth, characters, response, session, logger }: HttpContext) {
    try {
      await auth.use('web').logout()
      characters.clearCurrentCharacter()
      return response.redirect().back()
    } catch (error) {
      logger.error({ err: error }, 'Failed to logout')

      session.flashErrors({
        E_LOGOUT:
          'Une erreur est survenue. Impossible de vous déconnecter. Contactez un administrateur du site ou supprimez vos cookies manuellement.',
      })

      return response.redirect().back()
    }
  }

  async deleteUser({ auth, characters, request, response, session, logger }: HttpContext) {
    const user = auth.user!

    await request.validateUsing(createDeleteUserConfirmationValidator(user.name))

    try {
      await user.delete()

      await auth.use('web').logout()
      characters.clearCurrentCharacter()

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
