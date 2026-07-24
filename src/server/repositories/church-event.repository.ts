import type { AnySQLiteColumn } from 'drizzle-orm/sqlite-core'
import { and, count, eq, gte, isNull, like, lt, or } from 'drizzle-orm'
import { db } from '#server/db'
import { churchEvents } from '#server/db/schema'
import type { UsersColumns } from '#server/repositories/user.repository.ts'
import { lower } from '#shared/lib/sql.ts'
import type { OrderBy } from '#shared/types/database.types.ts'
import { BaseRepository } from './base.repository'

type EventSchemaKeys = keyof typeof churchEvents.$inferSelect

type EventsColumns = {
  [K in EventSchemaKeys]?: boolean
}

class ChurchEventRepository extends BaseRepository<typeof churchEvents> {
  constructor() {
    super(undefined, churchEvents)
  }

  async findLatest<TColumns extends EventsColumns>(limit: number, columns: TColumns) {
    return this.db.query.churchEvents.findMany({
      limit,
      columns,
      orderBy: (schema, { asc }) => [asc(schema.startDate)],
      where: this.#activeChurchEventSQLFilter(),
    })
  }

  async getChurchEvent<TColumns extends EventsColumns>({
    id,
    slug,
    columns,
    includeEndedEvent,
  }: ({ slug: string; id?: never } | { id: string; slug?: never }) & {
    columns?: TColumns
    includeEndedEvent?: boolean
  }) {
    return this.db.query.churchEvents.findFirst({
      columns,
      where: and(
        id ? eq(this.schema.id, id) : eq(this.schema.slug, slug!),
        !includeEndedEvent ? this.#activeChurchEventSQLFilter() : undefined
      ),
    })
  }

  async getChurchEventWithAuthor<
    TColumns extends EventsColumns,
    TAuthorColumns extends UsersColumns,
  >({
    id,
    slug,
    columns,
    authorColumns,
    includeEndedEvent,
  }: ({ slug: string; id?: never } | { id: string; slug?: never }) & {
    columns?: TColumns
    authorColumns?: TAuthorColumns
    includeEndedEvent?: boolean
  }) {
    return this.db.query.churchEvents.findFirst({
      columns,
      with: {
        author: authorColumns ? { columns: authorColumns } : true,
      },
      where: and(
        id ? eq(this.schema.id, id) : eq(this.schema.slug, slug!),
        !includeEndedEvent ? this.#activeChurchEventSQLFilter() : undefined
      ),
    })
  }

  async getChurchEvents<TColumns extends EventsColumns>(
    options: {
      columns?: TColumns
      page?: number
      pageSize?: number
      includeEndedEvents?: boolean
      orderBy?: Array<OrderBy<TColumns>>
      searchText?: Array<{ column: keyof EventsColumns; text: string }>
    } = {}
  ) {
    const {
      columns,
      page = 1,
      pageSize = 6,
      includeEndedEvents,
      orderBy = ['startDate.asc'],
      searchText,
    } = options

    const whereClause = and(
      !includeEndedEvents ? this.#activeChurchEventSQLFilter() : undefined,
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
      this.db.query.churchEvents.findMany({
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
        .select({ churchEventsCount: count(churchEvents.slug) })
        .from(churchEvents)
        .where(whereClause),
    ])

    return { churchEvents: data, total: total[0].churchEventsCount }
  }

  async deleteChurchEvent({ id }: { id: string }) {
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

  async cleanup() {
    const now = new Date()
    const fourDaysAgo = new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000)
    const result = await this.db
      .delete(this.schema)
      .where(
        or(
          lt(this.schema.endDate, fourDaysAgo),
          and(isNull(this.schema.endDate), lt(this.schema.startDate, fourDaysAgo))
        )
      )

    return result.rowsAffected
  }

  #activeChurchEventSQLFilter() {
    return and(gte(this.schema.startDate, new Date()), gte(this.schema.endDate, new Date()))
  }
}

export const churchEventRepository = new ChurchEventRepository()
