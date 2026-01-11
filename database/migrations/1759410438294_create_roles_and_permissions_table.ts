import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected permissionsTableName = 'permissions'
  protected rolesTableName = 'roles'
  protected userRolesTableName = 'user_roles'
  protected rolePermissionsTableName = 'role_permissions'

  async up() {
    this.schema.createTable(this.permissionsTableName, (table) => {
      table.increments('id').primary()
      table.string('slug', 100).unique().notNullable().index()
      table.string('name', 100).notNullable()
      table.text('description')
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })

    this.schema.createTable(this.rolesTableName, (table) => {
      table.increments('id').primary()
      table.string('slug', 100).unique().notNullable().index()
      table.string('name', 100).notNullable()
      table.text('description')
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })

    this.schema.createTable(this.userRolesTableName, (table) => {
      table.integer('user_id').notNullable().references('users.id').onDelete('CASCADE').index()
      table.integer('role_id').notNullable().references('roles.id').onDelete('CASCADE').index()
      table.primary(['user_id', 'role_id'])
    })

    this.schema.createTable(this.rolePermissionsTableName, (table) => {
      table.integer('role_id').notNullable().references('roles.id').onDelete('CASCADE').index()
      table
        .integer('permission_id')
        .notNullable()
        .references('permissions.id')
        .onDelete('CASCADE')
        .index()
      table.primary(['role_id', 'permission_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.rolePermissionsTableName)
    this.schema.dropTable(this.userRolesTableName)
    this.schema.dropTable(this.rolesTableName)
    this.schema.dropTable(this.permissionsTableName)
  }
}
