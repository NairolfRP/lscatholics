import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'rename_some_tables'

  async up() {
    this.schema.renameTable('events', 'scheduled_events')

    this.schema.renameTable('job_offers', 'job_postings')
  }

  async down() {
    this.schema.renameTable('scheduled_events', 'events')
    this.schema.renameTable('job_postings', 'job_offers')
  }
}
