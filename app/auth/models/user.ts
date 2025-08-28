import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import Account from '#auth/models/account'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import News from '#news/models/news'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @hasMany(() => Account)
  declare accounts: HasMany<typeof Account>

  @hasMany(() => News, {
    foreignKey: 'authorId',
  })
  declare articles: HasMany<typeof News>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}
