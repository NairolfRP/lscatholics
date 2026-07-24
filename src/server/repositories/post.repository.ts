import type { AnySQLiteColumn } from 'drizzle-orm/sqlite-core'
import { and, count, eq, like, or } from 'drizzle-orm'
import { POST_STATUS } from '#/shared/constants/post-status'
import type { PostStatus } from '#/shared/types/post.types'
import type { UsersColumns } from '#server/repositories/user.repository.ts'
import { lower } from '#shared/lib/sql.ts'
import type { OrderBy } from '#shared/types/database.types.ts'
import { db } from '../db'
import { posts } from '../db/schema'
import { BaseRepository } from './base.repository'

type PostSchemaKeys = keyof typeof posts.$inferSelect

type PostsColumns = {
  [K in PostSchemaKeys]?: boolean
}

class PostRepository extends BaseRepository<typeof posts> {
  constructor() {
    super(undefined, posts)
  }

  async findLatest<TColumns extends PostsColumns>(limit: number, columns: TColumns) {
    return this.db.query.posts.findMany({
      limit,
      columns,
      where: (schema) => eq(schema.status, POST_STATUS.PUBLISHED),
      orderBy: (schema, { desc }) => [desc(schema.publishedAt)],
    })
  }

  async getPost<TColumns extends PostsColumns>({
    id,
    slug,
    columns,
    status = POST_STATUS.PUBLISHED,
  }: ({ slug: string; id?: never } | { id: string; slug?: never }) & {
    columns?: TColumns
    status?: PostStatus | null
  }) {
    return this.db.query.posts.findFirst({
      columns,
      where: (schema) =>
        and(
          id ? eq(schema.id, id) : eq(schema.slug, slug!),
          status !== null ? eq(schema.status, status) : undefined
        ),
    })
  }

  async getPostWithAuthor<TColumns extends PostsColumns, TAuthorColumns extends UsersColumns>({
    id,
    slug,
    columns,
    authorColumns,
    status = POST_STATUS.PUBLISHED,
  }: ({ slug: string; id?: never } | { id: string; slug?: never }) & {
    columns?: TColumns
    authorColumns?: TAuthorColumns
    status?: PostStatus | null
  }) {
    return this.db.query.posts.findFirst({
      columns,
      with: {
        author: authorColumns ? { columns: authorColumns } : true,
      },
      where: (schema) =>
        and(
          id ? eq(schema.id, id) : eq(schema.slug, slug!),
          status !== null ? eq(schema.status, status) : undefined
        ),
    })
  }

  async getPosts<TColumns extends PostsColumns>(
    options: {
      columns?: TColumns
      pageSize?: number
      page?: number
      status?: PostStatus | null
      orderBy?: Array<OrderBy<TColumns>>
      searchText?: Array<{ column: keyof PostsColumns; text: string }>
    } = {}
  ) {
    const {
      columns,
      page = 1,
      pageSize = 6,
      status = POST_STATUS.PUBLISHED,
      orderBy = ['publishedAt.desc'],
      searchText,
    } = options

    const whereClause = and(
      status !== null ? eq(this.schema.status, status) : undefined,
      searchText && searchText.length > 0
        ? or(
            ...searchText.map((s) => {
              const column = s.column as keyof typeof this.schema
              return like(lower(this.schema[column] as AnySQLiteColumn), s.text.toLowerCase())
            })
          )
        : undefined
    )

    const [data, total] = await Promise.all([
      this.db.query.posts.findMany({
        columns,
        limit: pageSize,
        offset: (page - 1) * pageSize,
        where: whereClause,
        orderBy: (schema, { desc, asc }) =>
          orderBy.map((raw) => {
            const [column, order] = raw.split('.') as [keyof typeof schema, 'asc' | 'desc']
            return order === 'asc' ? asc(schema[column]) : desc(schema[column])
          }),
      }),
      db
        .select({ postsCount: count(posts.slug) })
        .from(posts)
        .where(whereClause),
    ])

    return { posts: data, total: total[0].postsCount }
  }

  async existsBySlug(slug: string): Promise<boolean> {
    const result = await db
      .select({ id: this.schema.id })
      .from(this.schema)
      .where(eq(this.schema.slug, slug))
      .limit(1)

    return result.length > 0
  }

  async deletePost({ id }: { id: string }) {
    return this.db.delete(this.schema).where(eq(this.schema.id, id))
  }
}

export const postRepository = new PostRepository()
