import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'pending_payments'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.string('source').notNullable()
      table.integer('amount').notNullable()
      table.integer('mode').notNullable().defaultTo(0)
      table.json('metadata').notNullable().defaultTo('{}')
      table.timestamp('expires_at').notNullable().index()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
