import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, belongsTo, column } from '@adonisjs/lucid/orm'
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

  @beforeCreate()
  static async assignSlugIfEmpty(article: News) {
    if (article.status === 'published' && !article.publishedAt) {
      article.publishedAt = DateTime.fromJSDate(new Date())
    }

    if (!article.slug) {
      article.slug = article.title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
    }
  }

  public static published() {
    return this.query().where('status', 'published')
  }

  public static drafts() {
    return this.query().where('status', 'draft')
  }

  public static archived() {
    return this.query().where('status', 'archived')
  }

  public static draftsByUser(user: User) {
    return this.query()
      .where('status', 'draft')
      .where('authorId', user.id)
      .orderBy('createdAt', 'desc')
  }
}
