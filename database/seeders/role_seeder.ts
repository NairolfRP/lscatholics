import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Role from '#auth/models/role'

export default class extends BaseSeeder {
  async run() {
    const roles = await Role.createMany([
      {
        slug: 'admin',
        name: 'Admin',
        description: 'Application administrator with full access',
      },
    ])

    await roles[0].assignPermissions([1, 2, 3, 4, 5, 6, 7])
  }
}
