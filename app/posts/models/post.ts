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
  static async assignSlugIfEmpty(post: Post) {
    if (post.status === 'published' && !post.publishedAt) {
      post.publishedAt = DateTime.fromJSDate(new Date())
    }

    if (!post.slug) {
      const base = post.title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')

      post.slug = await Post.generateUniqueSlug(base)
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

  static async generateUniqueSlug(base: string): Promise<string> {
    let slug = base
    let i = 2
    while (await Post.findBy('slug', slug)) {
      slug = `${base}-${i++}`
    }
    return slug
  }
}
