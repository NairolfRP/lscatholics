import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import Role from '#models/role'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Permission from '#models/permission'

export default class RolePermission extends BaseModel {
  @column({ isPrimary: true })
  declare roleId: number

  @column({ isPrimary: true })
  declare permissionId: number

  @belongsTo(() => Role)
  declare role: BelongsTo<typeof Role>

  @belongsTo(() => Permission)
  declare permission: BelongsTo<typeof Permission>
}
