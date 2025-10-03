import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected userRolesTableName = 'user_roles'
  protected rolePermissionsTableName = 'role_permissions'

  async up() {
    this.schema.alterTable(this.userRolesTableName, (table) => {
      table.dropPrimary()
      table.increments('id')
      table.unique(['user_id', 'role_id'])

      table.primary(['id'])
    })

    this.schema.alterTable(this.rolePermissionsTableName, (table) => {
      table.dropPrimary()
      table.increments('id').primary()
      table.unique(['role_id', 'permission_id'])

      table.primary(['id'])
    })
  }

  async down() {
    this.schema.alterTable(this.userRolesTableName, (table) => {
      table.dropColumn('id').dropPrimary()
      table.primary(['user_id', 'role_id'])
    })

    this.schema.alterTable(this.rolePermissionsTableName, (table) => {
      table.dropColumn('id').dropPrimary()
      table.primary(['role_id', 'permission_id'])
    })
  }
}
