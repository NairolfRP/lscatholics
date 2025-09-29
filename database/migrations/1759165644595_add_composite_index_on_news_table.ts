import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'news'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropIndex('status')
      table.dropIndex('published_at')
      this.schema.raw(
        `CREATE INDEX news_status_published_at ON ${this.tableName} (status, published_at DESC)`
      )
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      this.schema.raw(`DROP INDEX news_status_published_at`)
      table.index('status')
      table.index('published_at')
    })
  }
}
