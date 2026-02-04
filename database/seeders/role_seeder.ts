import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Role from '#auth/models/role'
import RolePermission from '#auth/models/role_permission'

export default class RoleSeeder extends BaseSeeder {
  async run() {
    const rolesUniqueKey = 'slug' as const

    const roles = await Role.updateOrCreateMany(rolesUniqueKey, [
      {
        slug: 'admin',
        name: 'Admin',
        description: 'Application administrator with full access',
      },
    ])

    const rolePermissionsUniqueKey = ['roleId', 'permissionId'] as Array<'roleId' | 'permissionId'>
    const adminRoleId = roles[0].id
    const adminPermissions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]

    await RolePermission.updateOrCreateMany(
      rolePermissionsUniqueKey,
      adminPermissions.map((permissionId) => ({
        roleId: adminRoleId,
        permissionId,
      }))
    )
  }
}
