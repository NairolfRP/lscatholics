import { belongsTo } from '@adonisjs/lucid/orm'
import Role from '#roles/models/role'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Permission from '#roles/models/permission'
import { RolePermissionSchema } from '#database/schema'

export default class RolePermission extends RolePermissionSchema {
  @belongsTo(() => Role)
  declare role: BelongsTo<typeof Role>

  @belongsTo(() => Permission)
  declare permission: BelongsTo<typeof Permission>
}
