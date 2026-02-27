import { hasMany, manyToMany } from '@adonisjs/lucid/orm'
import Account from '#users/models/account'
import type { HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import Post from '#posts/models/post'
import Role from '#roles/models/role'
import { UserSchema } from '#database/schema'

export default class User extends UserSchema {
  @hasMany(() => Account)
  declare accounts: HasMany<typeof Account>

  @hasMany(() => Post, {
    foreignKey: 'authorId',
  })
  declare articles: HasMany<typeof Post>

  @manyToMany(() => Role, {
    pivotTable: 'user_roles',
  })
  declare roles: ManyToMany<typeof Role>

  async hasPermission(permissionSlug: string): Promise<boolean> {
    if (this.$preloaded.roles) {
      return this.roles.some((role) => {
        if (role.$preloaded.permissions) {
          return role.permissions.some((permission) => permission.slug === permissionSlug)
        }

        return false
      })
    }
    const roles = await (this as User).related('roles').query().preload('permissions')

    return roles.some((role) =>
      role.permissions.some((permission) => permission.slug === permissionSlug)
    )
  }

  async getPermissions(): Promise<string[]> {
    if (this.$extras.permissionsCache) {
      return this.$extras.permissionsCache
    }

    if (this.$preloaded.roles) {
      const permissions = new Set<string>()

      for (const role of this.roles) {
        if (role.$preloaded.permissions) {
          for (const permission of role.permissions) {
            permissions.add(permission.slug)
          }
        }
      }

      if (permissions.size > 0) {
        this.$extras.permissionsCache = Array.from(permissions)
        return this.$extras.permissionsCache
      }
    }

    const roles = await (this as User).related('roles').query().preload('permissions')

    const permissions = new Set<string>()

    for (const role of roles) {
      for (const permission of role.permissions) {
        permissions.add(permission.slug)
      }
    }

    this.$extras.permissionsCache = Array.from(permissions)
    return this.$extras.permissionsCache
  }

  clearPermissionsCache() {
    delete this.$extras.permissionsCache
  }

  getHighestRole() {
    return this.roles.reduce((best, role) =>
      role.hierarchyOrder < best.hierarchyOrder ? role : best
    )
  }

  async assignRole(roleId: number): Promise<void> {
    await (this as User).related('roles').attach([roleId])
    this.clearPermissionsCache()
  }

  async removeRole(roleId: number): Promise<void> {
    await (this as User).related('roles').detach([roleId])
    this.clearPermissionsCache()
  }

  async syncRoles(roleIds: number[]): Promise<void> {
    await (this as User).related('roles').sync(roleIds)
    this.clearPermissionsCache()
  }
}
