import type { AnySQLiteColumn } from 'drizzle-orm/sqlite-core'
import { and, asc, count, desc, eq, gte, isNotNull, isNull, like, lt, or } from 'drizzle-orm'
import { getMonthBounds } from '#/utils/date.ts'
import { db } from '#server/db'
import { churchEvents } from '#server/db/schema'
import type { UsersColumns } from '#server/repositories/user.repository.ts'
import { CHURCH_EVENT_RETENTION_DAYS } from '#shared/constants/church-event.constants.ts'
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
      orderBy: { startDate: 'asc' },
      where: this.#activeChurchEventFilter(),
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
      where: {
        ...(id ? { id } : { slug: slug! }),
        ...(!includeEndedEvent ? this.#activeChurchEventFilter() : {}),
      },
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
      where: {
        ...(id ? { id } : { slug: slug! }),
        ...(!includeEndedEvent ? this.#activeChurchEventFilter() : {}),
      },
    })
  }

  async getChurchEvents<TColumns extends EventsColumns>(
    options: {
      columns?: TColumns
      page?: number
      pageSize?: number
      includeEndedEvents?: boolean
      orderBy?: OrderBy<TColumns>[]
      searchText?: { column: keyof EventsColumns; text: string }[]
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

    const searchSql =
      searchText && searchText.length > 0
        ? or(
            ...searchText.map((s) => {
              const column = s.column as keyof typeof this.schema
              return like(lower(this.schema[column] as AnySQLiteColumn), s.text.toLowerCase())
            })
          )
        : undefined

    const whereFilter = {
      ...(!includeEndedEvents ? this.#activeChurchEventFilter() : {}),
      ...(searchSql ? { RAW: searchSql } : {}),
    }

    const whereClause = and(
      !includeEndedEvents
        ? and(gte(this.schema.startDate, new Date()), gte(this.schema.endDate, new Date()))
        : undefined,
      searchSql
    )

    const [data, total] = await Promise.all([
      this.db.query.churchEvents.findMany({
        columns,
        limit: pageSize,
        offset: (page - 1) * pageSize,
        where: whereFilter,
        orderBy: (table) =>
          orderBy.map((raw) => {
            const [column, order] = raw.split('.') as [keyof typeof table, 'asc' | 'desc']
            const col = table[column] as AnySQLiteColumn
            return order === 'asc' ? asc(col) : desc(col)
          }),
      }),
      db
        .select({ churchEventsCount: count(churchEvents.slug) })
        .from(churchEvents)
        .where(whereClause),
    ])

    return { churchEvents: data, total: total[0].churchEventsCount }
  }

  async getChurchEventsByYearMonth<TColumns extends EventsColumns>(
    options: {
      columns?: TColumns
      period?: { year: number; month: number }
      includeEndedEvents?: boolean
    } = {}
  ) {
    const {
      columns,
      period = { year: new Date().getFullYear(), month: new Date().getMonth() + 1 },
      includeEndedEvents,
    } = options

    const { from: monthStart, to: monthEnd } = getMonthBounds(period)

    const monthOverlap = and(
      lt(this.schema.startDate, monthEnd),
      or(
        and(isNotNull(this.schema.endDate), gte(this.schema.endDate, monthStart)),
        and(isNull(this.schema.endDate), gte(this.schema.startDate, monthStart))
      )
    )
    const notEnded = or(isNull(this.schema.endDate), gte(this.schema.endDate, new Date()))

    return db.query.churchEvents.findMany({
      columns,
      where: { RAW: and(monthOverlap, includeEndedEvents ? undefined : notEnded) },
      orderBy: { startDate: 'asc' },
    })
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
    const fourDaysAgo = new Date(now.getTime() - CHURCH_EVENT_RETENTION_DAYS * 24 * 60 * 60 * 1000)
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

  #activeChurchEventFilter() {
    return { startDate: { gte: new Date() }, endDate: { gte: new Date() } }
  }
}

export const churchEventRepository = new ChurchEventRepository()
