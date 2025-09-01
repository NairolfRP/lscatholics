import type { HttpContext } from '@adonisjs/core/http'
import Account from '#auth/models/account'
import User from '#auth/models/user'
import { DateTime } from 'luxon'
import db from '@adonisjs/lucid/services/db'

export default class AuthController {
  async redirectToProvider({ ally }: HttpContext) {
    return ally.use('gtaw').redirect()
  }

  async handleCallback({ ally, auth, characters, response }: HttpContext) {
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

    return response.redirect().back()
  }

  async logout({ auth, characters, response }: HttpContext) {
    await auth.use('web').logout()
    characters.clearCurrentCharacter()
    return response.redirect('/')
  }
}
