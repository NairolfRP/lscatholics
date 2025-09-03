import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'events'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()

      table.string('title').notNullable()
      table.string('slug').notNullable().unique().index()
      table.string('description').notNullable()
      table.text('content').notNullable()
      table.string('location').notNullable().index()
      table.integer('parish_id').nullable()
      table.text('cover_image_url').nullable()
      table.text('flyer_url').nullable()
      table.boolean('registration_required').defaultTo(false)
      table.integer('max_participants').nullable()
      table.timestamp('start_date', { useTz: true }).notNullable().index()
      table.timestamp('end_date', { useTz: true }).nullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
