import { posts } from '#/server/db/schema'
import { Factory } from './factory'

export const postFactory = Factory.define(posts, ({ faker }) => ({
  title: faker.lorem.sentence({ min: 3, max: 8 }),
  slug: faker.helpers.slugify(`${faker.lorem.words(4)}-${faker.string.nanoid(6)}`).toLowerCase(),
  category: faker.helpers.arrayElement(['tech', 'lifestyle', 'news', 'tutorial', null]),
  content: faker.lorem.paragraphs({ min: 3, max: 8 }, '\n\n'),
  excerpt: faker.lorem.sentences({ min: 1, max: 3 }),
  coverImageUrl: faker.image.url(),
  status: faker.helpers.weightedArrayElement([
    { value: 'published', weight: 5 },
    { value: 'draft', weight: 3 },
    { value: 'archived', weight: 1 },
  ]),
  publishedAt: faker.date.recent({ days: 365 }),
  authorId: null,
}))
