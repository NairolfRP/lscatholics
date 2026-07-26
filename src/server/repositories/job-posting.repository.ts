import type { AnySQLiteColumn } from 'drizzle-orm/sqlite-core'
import { and, count, eq, gte, like, or } from 'drizzle-orm'
import { db } from '#server/db'
import { jobPostings } from '#server/db/schema/job-posting-schema'
import { BaseRepository } from '#server/repositories/base.repository.ts'
import type { UsersColumns } from '#server/repositories/user.repository.ts'
import { lower } from '#shared/lib/sql.ts'
import type { OrderBy } from '#shared/types/database.types.ts'

type EventSchemaKeys = keyof typeof jobPostings.$inferSelect

type JobPostingsColumns = {
  [K in EventSchemaKeys]?: boolean
}

class JobPostingRepository extends BaseRepository<typeof jobPostings> {
  constructor() {
    super(undefined, jobPostings)
  }

  async getJobPosting<TColumns extends JobPostingsColumns>({
    id,
    slug,
    columns,
    includeInactive,
    includeExpired,
  }: ({ slug: string; id?: never } | { id: string; slug?: never }) & {
    columns?: TColumns
    includeInactive?: boolean
    includeExpired?: boolean
  }) {
    return this.db.query.jobPostings.findFirst({
      columns,
      where: and(
        id ? eq(this.schema.id, id) : eq(this.schema.slug, slug!),
        !includeInactive ? this.#activeJobOpeningSQLFilter() : undefined,
        !includeExpired ? this.#notExpiredJobOpeningSQLFilter() : undefined
      ),
    })
  }

  async getJobPostingWithAuthor<
    TColumns extends JobPostingsColumns,
    TAuthorColumns extends UsersColumns,
  >({
    id,
    slug,
    columns,
    authorColumns,
    includeInactive,
    includeExpired,
  }: ({ slug: string; id?: never } | { id: string; slug?: never }) & {
    columns?: TColumns
    authorColumns?: TAuthorColumns
    includeInactive?: boolean
    includeExpired?: boolean
  }) {
    return this.db.query.jobPostings.findFirst({
      columns,
      with: {
        author: authorColumns ? { columns: authorColumns } : true,
      },
      where: and(
        id ? eq(this.schema.id, id) : eq(this.schema.slug, slug!),
        !includeInactive ? this.#activeJobOpeningSQLFilter() : undefined,
        !includeExpired ? this.#notExpiredJobOpeningSQLFilter() : undefined
      ),
    })
  }

  async getJobPostings<TColumns extends JobPostingsColumns>(
    options: {
      columns?: TColumns
      page?: number
      pageSize?: number
      includeInactives?: boolean
      includeExpired?: boolean
      orderBy?: OrderBy<TColumns>[]
      searchText?: { column: keyof JobPostingsColumns; text: string }[]
    } = {}
  ) {
    const {
      columns,
      page = 1,
      pageSize = 6,
      includeInactives,
      includeExpired,
      orderBy = ['createdAt.asc'],
      searchText,
    } = options

    const whereClause = and(
      !includeInactives ? this.#activeJobOpeningSQLFilter() : undefined,
      !includeExpired ? this.#notExpiredJobOpeningSQLFilter() : undefined,
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
      this.db.query.jobPostings.findMany({
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
      this.db
        .select({ jobPostingsCount: count(this.schema.slug) })
        .from(this.schema)
        .where(whereClause),
    ])

    return { jobPostings: data, total: total[0].jobPostingsCount }
  }

  async deleteJobPosting({ id }: { id: string }) {
    return this.db.delete(this.schema).where(eq(this.schema.id, id))
  }

  async existsBySlug(slug: string): Promise<boolean> {
    const result = await db
      .select({ id: this.schema.id })
      .from(this.schema)
      .where(eq(this.schema.slug, slug))
      .limit(1)

    return result.length > 0
  }

  #activeJobOpeningSQLFilter() {
    return eq(this.schema.isActive, true)
  }

  #notExpiredJobOpeningSQLFilter() {
    return gte(this.schema.expiresAt, new Date())
  }
}

export const jobPostingRepository = new JobPostingRepository()
