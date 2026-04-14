import User from '#users/models/user'
import factory from '@adonisjs/lucid/factories'
import { AccountFactory } from '#database/factories/account_factory'

export const UserFactory = factory
  .define(User, async ({ faker }) => {
    return {
      name: faker.internet.username(),
    }
  })
  .relation('accounts', () => AccountFactory)
  .build()
