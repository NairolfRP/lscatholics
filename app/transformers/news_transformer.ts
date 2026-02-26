import { BaseTransformer } from '@adonisjs/core/transformers'
import type News from '#models/news'
import UserTransformer from '#transformers/user_transformer'

export default class NewsTransformer extends BaseTransformer<News> {
  toObject() {
    return this.pick(this.resource, ['id', 'title', 'createdAt', 'status', 'authorId'])
  }

  allFields() {
    return {
      ...this.pick(this.resource, [
        'id',
        'title',
        'slug',
        'category',
        'content',
        'excerpt',
        'coverImageUrl',
        'status',
        'publishedAt',
        'createdAt',
        'updatedAt',
      ]),
      author: UserTransformer.transform(this.resource.author),
    }
  }

  homePosts() {
    return this.pick(this.resource, [
      'id',
      'slug',
      'title',
      'excerpt',
      'coverImageUrl',
      'category',
      'publishedAt',
    ])
  }

  publicList() {
    return this.pick(this.resource, [
      'id',
      'slug',
      'title',
      'category',
      'excerpt',
      'coverImageUrl',
      'publishedAt',
    ])
  }

  publicDetails() {
    return this.pick(this.resource, [
      'slug',
      'title',
      'excerpt',
      'coverImageUrl',
      'category',
      'content',
      'publishedAt',
      'updatedAt',
      'status',
    ])
  }
}
