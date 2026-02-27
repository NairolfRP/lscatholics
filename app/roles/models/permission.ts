import { manyToMany } from '@adonisjs/lucid/orm'
import Role from '#roles/models/role'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import { PermissionSchema } from '#database/schema'

export default class Permission extends PermissionSchema {
  @manyToMany(() => Role, {
    pivotTable: 'role_permissions',
  })
  declare roles: ManyToMany<typeof Role>
}
