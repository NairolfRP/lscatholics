import { DateTime } from 'luxon'
import { BaseModel, column, scope } from '@adonisjs/lucid/orm'

export default class Job extends BaseModel {
  static table = 'job_offers'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare slug: string

  @column()
  declare title: string

  @column()
  declare summary: string | null

  @column()
  declare reportsTo: string | null

  @column()
  declare department: string

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

  @column()
  declare salary: number | null

  @column()
  declare employmentType: string

  @column()
  declare isActive: boolean

  @column.dateTime()
  declare postedAt: DateTime | null

  @column.dateTime()
  declare expiresAt: DateTime | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

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
