import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'job_offers'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('slug').notNullable().unique()

      table.string('title').notNullable()
      table.text('summary').nullable()
      table.string('reports_to').nullable()
      table.string('department').notNullable()
      table.json('responsibilities').nullable()
      table.json('requirements').nullable()

      table.integer('salary').nullable()

      table.string('employment_type').notNullable()

      table.boolean('is_active').notNullable().defaultTo(true)
      table.timestamp('posted_at').nullable()
      table.timestamp('expires_at').nullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTableIfExists(this.tableName)
  }
}
