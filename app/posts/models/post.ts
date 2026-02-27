import { DateTime } from 'luxon'
import { beforeCreate, belongsTo, column } from '@adonisjs/lucid/orm'
import User from '#users/models/user'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { NewsSchema } from '#database/schema'

export default class Post extends NewsSchema {
  public static table = 'news'

  public static routeLookupKey = 'slug'

  @column()
  declare status: 'draft' | 'published' | 'archived'

  @belongsTo(() => User, {
    foreignKey: 'authorId',
  })
  declare author: BelongsTo<typeof User>

  @beforeCreate()
  static async assignSlugIfEmpty(article: Post) {
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
