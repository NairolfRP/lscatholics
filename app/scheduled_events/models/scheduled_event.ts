import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class ScheduledEvent extends BaseModel {
  public static table = 'scheduled_events'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare title: string

  @column()
  declare slug: string

  @column()
  declare description: string

  @column()
  declare content: string

  @column()
  declare location: string

  @column()
  declare parishId: number | null

  @column()
  declare coverImageUrl: string | null

  @column()
  declare flyerUrl: string | null

  @column()
  declare registrationRequired: boolean

  @column()
  declare maxParticipants: number | null

  @column.dateTime()
  declare startDate: DateTime

  @column.dateTime()
  declare endDate: DateTime | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
