import factory from '@adonisjs/lucid/factories'
import Permission from '#roles/models/permission'

export const PermissionFactory = factory
  .define(Permission, async ({ faker }) => {
    return {
      slug: faker.lorem.slug(),
      name: faker.person.jobTitle(),
      description: faker.lorem.sentence({ min: 10, max: 150 }),
    }
  })
  .build()
