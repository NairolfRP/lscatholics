import { manyToMany } from '@adonisjs/lucid/orm'
import User from '#users/models/user'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import Permission from '#roles/models/permission'
import { RoleSchema } from '#database/schema'

export default class Role extends RoleSchema {
  @manyToMany(() => User, {
    pivotTable: 'user_roles',
  })
  declare users: ManyToMany<typeof User>

  @manyToMany(() => Permission, {
    pivotTable: 'role_permissions',
  })
  declare permissions: ManyToMany<typeof Permission>

  async assignPermissions(permissionIds: number[]): Promise<void> {
    await (this as Role).related('permissions').attach(permissionIds)
  }

  async syncPermissions(permissionIds: number[]): Promise<void> {
    await (this as Role).related('permissions').sync(permissionIds)
  }
}
