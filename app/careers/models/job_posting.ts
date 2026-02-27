import { DateTime } from 'luxon'
import { column, scope } from '@adonisjs/lucid/orm'
import { JobPostingSchema } from '#database/schema'

export default class JobPosting extends JobPostingSchema {
  public static table = 'job_postings'

  @column({
    prepare: (value) => JSON.stringify(value ?? []),
    consume: (value) => (value ? JSON.parse(value) : null),
  })
  declare responsibilities: string[]

  @column({
    prepare: (value) => JSON.stringify(value ?? []),
    consume: (value) => (value ? JSON.parse(value) : null),
  })
  declare requirements: string[]

  async checkAndDeactivate(): Promise<boolean> {
    if (this.isActive && this.expiresAt && this.expiresAt < DateTime.now()) {
      this.isActive = false
      await this.save()
      return true
    }
    return false
  }

  static active = scope((query) => {
    return query.where('is_active', true).where((q) => {
      q.whereNull('expires_at').orWhere('expires_at', '>=', DateTime.now().toSQL())
    })
  })
}
