import factory from '@adonisjs/lucid/factories'
import Role from '#roles/models/role'

export const RoleFactory = factory
  .define(Role, async ({ faker }) => {
    return {
      slug: faker.lorem.slug(),
      name: faker.person.jobTitle(),
      description: faker.lorem.sentence({ min: 10, max: 150 }),
      hierarchyOrder: faker.number.int({ min: 1, max: 999999999 }),
    }
  })
  .build()
