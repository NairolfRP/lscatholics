import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'
import User from '#auth/models/user'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import Permission from '#auth/models/permission'

export default class Role extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare slug: string

  @column()
  declare name: string

  @column()
  declare description: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

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
