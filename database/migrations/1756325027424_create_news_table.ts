import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'news'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('title').notNullable()
      table.string('slug').notNullable().unique()
      table.string('category').nullable()
      table.text('content').notNullable()
      table.text('excerpt')
      table.string('cover_image_url')

      table.enum('status', ['draft', 'published', 'archived']).defaultTo('draft').notNullable()
      table.timestamp('published_at', { useTz: true }).nullable()

      table
        .bigInteger('author_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('SET NULL')

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })

      table.index('status')
      table.index('published_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
