import { relations, sql } from 'drizzle-orm'
import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { POST_STATUS, POST_STATUS_VALUES } from '#/shared/constants/post-status'
import { timestamps } from '#server/db/helpers.ts'
import { users } from './auth-schema'

export const posts = sqliteTable(
  'posts',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    title: text('title').notNull(),
    slug: text('slug').notNull().unique(),
    excerpt: text('excerpt'),
    category: text('category'),
    content: text('content').notNull(),
    coverImageUrl: text('cover_image_url').notNull(),
    status: text('status', { enum: POST_STATUS_VALUES }).notNull().default(POST_STATUS.DRAFT),
    publishedAt: integer('published_at', { mode: 'timestamp_ms' }).default(
      sql`(cast(unixepoch('subsecond') * 1000 as integer))`
    ),
    ...timestamps(),
    authorDisplayName: text('author_display_name').notNull().default('John Doe'),
    authorId: text('author_id').references(() => users.id, { onDelete: 'set null' }),
  },
  (table) => [
    index('posts_status_published_at_idx').on(table.status, table.publishedAt),
    index('posts_author_id_idx').on(table.authorId),
  ]
)

export const postsRelations = relations(posts, ({ one }) => ({
  author: one(users, {
    fields: [posts.authorId],
    references: [users.id],
  }),
}))
