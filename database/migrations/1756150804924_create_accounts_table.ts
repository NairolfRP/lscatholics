import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'accounts'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary().notNullable()
      table.integer('user_id').unsigned().references('users.id').onDelete('CASCADE').index()
      table.string('account_id').notNullable()
      table.string('provider_id').notNullable()
      table.text('access_token').nullable()
      table.text('refresh_token').nullable()
      table.timestamp('access_token_expires_at').nullable()
      table.timestamp('refresh_token_expires_at').nullable()
      table.string('scope').nullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')

      table.unique(['provider_id', 'account_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
