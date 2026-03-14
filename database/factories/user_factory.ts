import User from '#users/models/user'
import factory from '@adonisjs/lucid/factories'

export const UserFactory = factory
  .define(User, async ({ faker }) => {
    return {
      name: faker.internet.username(),
    }
  })
  .build()
