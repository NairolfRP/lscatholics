import factory from '@adonisjs/lucid/factories'
import Post from '#posts/models/post'
import { categories } from '#posts/controllers/posts_controller'
import { DateTime } from 'luxon'

export const PostFactory = factory
  .define(Post, async ({ faker }) => {
    return {
      title: faker.lorem.sentence().substring(0, 255),
      slug: faker.lorem.slug(),
      category: faker.helpers.arrayElement(categories.map((category) => category.id)),
      content: faker.lorem.paragraphs(faker.helpers.rangeToNumber({ min: 4, max: 10 })),
      excerpt: faker.lorem.text(),
      coverImageUrl: `https://picsum.photos/seed/${faker.string.alphanumeric({ length: { min: 12, max: 24 } })}/1024/500`,
      status: faker.helpers.arrayElement(['draft', 'published', 'archived']),
      publishedAt: DateTime.fromJSDate(faker.date.past()),
    }
  })
  .build()
