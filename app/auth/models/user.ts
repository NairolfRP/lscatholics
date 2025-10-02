import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import Account from '#auth/models/account'
import type { HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import News from '#news/models/news'
import Role from '#auth/models/role'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @hasMany(() => Account)
  declare accounts: HasMany<typeof Account>

  @hasMany(() => News, {
    foreignKey: 'authorId',
  })
  declare articles: HasMany<typeof News>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @manyToMany(() => Role, {
    pivotTable: 'user_roles',
  })
  declare roles: ManyToMany<typeof Role>

  async hasPermission(permissionSlug: string): Promise<boolean> {
    const roles = await (this as User).related('roles').query().preload('permissions')

    return roles.some((role) =>
      role.permissions.some((permission) => permission.slug === permissionSlug)
    )
  }

  async getPermissions(): Promise<string[]> {
    const roles = await (this as User).related('roles').query().preload('permissions')

    const permissions = new Set<string>()

    for (const role of roles) {
      for (const permission of role.permissions) {
        permissions.add(permission.slug)
      }
    }

    return Array.from(permissions)
  }

  async assignRole(roleId: number): Promise<void> {
    await (this as User).related('roles').attach([roleId])
  }

  async removeRole(roleId: number): Promise<void> {
    await (this as User).related('roles').detach([roleId])
  }

  async syncRoles(roleIds: number[]): Promise<void> {
    await (this as User).related('roles').sync(roleIds)
  }
}
