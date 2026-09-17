import type { AnySQLiteColumn } from 'drizzle-orm/sqlite-core'
import { and, count, EmptyFilter, eq, gte, isNull, or, sql } from 'drizzle-orm'
import { CAREERS_PAGINATION_LIMIT } from '#/features/job-posting/constants/job-posting.constants.ts'
import { db } from '#server/db'
import { jobPostings } from '#server/db/schema/job-posting-schema'
import { BaseRepository } from '#server/repositories/base.repository.ts'
import type { UsersColumns } from '#server/repositories/user.repository.ts'
import { lower } from '#shared/lib/sql.ts'
import type { OrderBy } from '#shared/types/database.types.ts'
import type { DepartmentId } from '#shared/types/department.types.ts'
import type { EmploymentType } from '#shared/types/employment.types.ts'

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
      where: {
        ...(id ? { id } : { slug: slug! }),
        ...(!includeInactive ? this.#activeFilter() : {}),
        ...(!includeExpired ? this.#notExpiredFilter() : {}),
      },
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
      where: {
        ...(id ? { id } : { slug: slug! }),
        ...(!includeInactive ? this.#activeFilter() : {}),
        ...(!includeExpired ? this.#notExpiredFilter() : {}),
      },
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
      departments?: DepartmentId[]
      employmentTypes?: EmploymentType[]
      searchText?: { column: keyof JobPostingsColumns; text: string }[]
    } = {}
  ) {
    const {
      columns,
      page = 1,
      pageSize = CAREERS_PAGINATION_LIMIT,
      includeInactives,
      includeExpired,
      orderBy = ['createdAt.asc'],
      departments = [],
      employmentTypes = [],
      searchText,
    } = options

    const searchFilter = (table: typeof jobPostings) =>
      searchText && searchText.length > 0
        ? or(
            ...searchText.map((s) => {
              const column = s.column as keyof typeof table
              return sql`${lower(table[column] as AnySQLiteColumn)} LIKE ${s.text.toLowerCase()} ESCAPE '\\'`
            })
          )
        : undefined

    const searchSql = (table: typeof jobPostings) => searchFilter(table) ?? EmptyFilter

    const whereFilter = {
      ...(!includeInactives ? this.#activeFilter() : {}),
      ...(!includeExpired ? this.#notExpiredFilter() : {}),
      ...(departments.length > 0 ? { department: { in: departments } } : {}),
      ...(employmentTypes.length > 0 ? { employmentType: { in: employmentTypes } } : {}),
      RAW: searchSql,
    }

    const whereClause = and(
      !includeInactives ? eq(this.schema.isActive, true) : undefined,
      !includeExpired
        ? or(isNull(this.schema.expiresAt), gte(this.schema.expiresAt, new Date()))
        : undefined,
      departments.length > 0
        ? or(...departments.map((dep) => eq(this.schema.department, dep)))
        : undefined,
      employmentTypes.length > 0
        ? or(...employmentTypes.map((type) => eq(this.schema.employmentType, type)))
        : undefined,
      searchFilter(this.schema)
    )

    const [data, total] = await Promise.all([
      this.db.query.jobPostings.findMany({
        columns,
        limit: pageSize,
        offset: (page - 1) * pageSize,
        where: whereFilter,
        orderBy: (schema, { asc, desc }) =>
          orderBy.map((raw) => {
            const [column, order] = raw.split('.') as [keyof typeof schema, 'asc' | 'desc']
            const col = schema[column] as AnySQLiteColumn
            return order === 'asc' ? asc(col) : desc(col)
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

  #activeFilter() {
    return { isActive: true }
  }

  #notExpiredFilter() {
    return {
      OR: [{ expiresAt: { isNull: true } } as const, { expiresAt: { gte: new Date() } } as const],
    }
  }
}

export const jobPostingRepository = new JobPostingRepository()
