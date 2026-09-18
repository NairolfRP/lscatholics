import type { InferSelectModel, SQL } from 'drizzle-orm'
import { and, asc, count, desc, eq, like, or, sql } from 'drizzle-orm'
import type { AnySQLiteColumn } from 'drizzle-orm/sqlite-core'
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
      where: { status: POST_STATUS.PUBLISHED },
      orderBy: { publishedAt: 'desc' },
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
      where: { ...(id ? { id } : { slug: slug! }), ...(status !== null ? { status } : {}) },
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
      where: { ...(id ? { id } : { slug: slug! }), ...(status !== null ? { status } : {}) },
    })
  }

  async getPosts<TColumns extends PostsColumns>(
    options: {
      columns?: TColumns
      pageSize?: number
      page?: number
      status?: PostStatus | null
      orderBy?: OrderBy<TColumns>[]
      searchText?: { column: keyof PostsColumns; text: string }[]
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

    const searchFilter = (table: typeof posts) =>
      searchText && searchText.length > 0
        ? or(
            ...searchText.map((s) => {
              const column = s.column as keyof typeof table
              return like(lower(table[column] as AnySQLiteColumn), s.text.toLowerCase())
            })
          )
        : undefined

    const whereClause = and(
      status !== null ? eq(this.schema.status, status) : undefined,
      searchFilter(this.schema)
    )

    const dataColumns =
      columns && Object.keys(columns).length > 0
        ? Object.fromEntries(
            Object.keys(columns).map((key) => [key, posts[key as keyof typeof posts]])
          )
        : Object.fromEntries(
            Object.keys(posts).map((key) => [key, posts[key as keyof typeof posts]])
          )

    const rows = await db
      .select({ ...dataColumns, total: sql<number>`count(*) over ()`.mapWith(Number) } as Record<
        string,
        AnySQLiteColumn | SQL
      >)
      .from(posts)
      .where(whereClause)
      .orderBy(
        ...orderBy.map((raw) => {
          const [column, order] = raw.split('.') as [keyof typeof posts, 'asc' | 'desc']
          const col = posts[column] as AnySQLiteColumn
          return order === 'asc' ? asc(col) : desc(col)
        })
      )
      .limit(pageSize)
      .offset((page - 1) * pageSize)

    const selectedRows = rows as (InferSelectModel<typeof posts> & { total: number })[]

    let total: number
    if (selectedRows.length > 0) {
      total = selectedRows[0].total
    } else {
      const countResult = await db
        .select({ postsCount: count(posts.slug) })
        .from(posts)
        .where(whereClause)
      total = countResult[0].postsCount
    }

    return {
      posts: selectedRows.map(({ total: _total, ...post }) => post) as InferSelectModel<
        typeof posts
      >[],
      total,
    }
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
