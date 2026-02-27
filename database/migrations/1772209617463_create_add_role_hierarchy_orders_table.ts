import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'roles'

  private newColumnName = 'hierarchy_order'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer(this.newColumnName).notNullable().defaultTo(99999)
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn(this.newColumnName)
    })
  }
}
