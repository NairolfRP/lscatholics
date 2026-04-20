import Factory from '@adonisjs/lucid/factories'
import AccountSchema from '#users/models/account'
import { DateTime } from 'luxon'

export const AccountFactory = Factory.define(AccountSchema, ({ faker }) => {
  return {
    accountId: faker.string.uuid(),
    providerId: 'gtaw',
    accessToken: faker.string.alphanumeric(64),
    refreshToken: faker.string.alphanumeric(64),
    accessTokenExpiresAt: DateTime.now().plus({ hours: 2 }),
    refreshTokenExpiresAt: DateTime.now().plus({ days: 30 }),
    scope: 'identify factions',
  }
})
  .state('expired', (account) => {
    account.accessTokenExpiresAt = DateTime.now().minus({ days: 1 })
  })
  .build()
