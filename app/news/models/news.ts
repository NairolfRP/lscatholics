import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import User from '#auth/models/user'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class News extends BaseModel {
  public static routeLookupKey = 'slug'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare title: string

  @column()
  declare slug: string

  @column()
  declare category: string

  @column()
  declare content: string

  @column()
  declare excerpt: string | null

  @column()
  declare coverImageUrl: string | null

  @column()
  declare status: 'draft' | 'published' | 'archived'

  @column.dateTime()
  declare publishedAt: DateTime | null

  @column()
  declare authorId: number | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User, {
    foreignKey: 'authorId',
  })
  declare author: BelongsTo<typeof User>
}
