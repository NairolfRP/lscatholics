import type { InferSelectModel, SQL } from 'drizzle-orm'
import { and, asc, count, desc, eq, gte, isNull, like, lt, or, sql } from 'drizzle-orm'
import type { AnySQLiteColumn } from 'drizzle-orm/sqlite-core'
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

    const searchFilter = (table: typeof churchEvents) =>
      searchText && searchText.length > 0
        ? or(
            ...searchText.map((s) => {
              const column = s.column as keyof typeof table
              return like(lower(table[column] as AnySQLiteColumn), s.text.toLowerCase())
            })
          )
        : undefined

    const whereClause = and(
      !includeEndedEvents
        ? and(gte(churchEvents.startDate, new Date()), gte(churchEvents.endDate, new Date()))
        : undefined,
      searchFilter(churchEvents)
    )

    const dataColumns =
      columns && Object.keys(columns).length > 0
        ? Object.fromEntries(
            Object.keys(columns).map((key) => [key, churchEvents[key as keyof typeof churchEvents]])
          )
        : Object.fromEntries(
            Object.keys(churchEvents).map((key) => [
              key,
              churchEvents[key as keyof typeof churchEvents],
            ])
          )

    const rows = await db
      .select({ ...dataColumns, total: sql<number>`count(*) over ()`.mapWith(Number) } as Record<
        string,
        AnySQLiteColumn | SQL
      >)
      .from(churchEvents)
      .where(whereClause)
      .orderBy(
        ...orderBy.map((raw) => {
          const [column, order] = raw.split('.') as [keyof typeof churchEvents, 'asc' | 'desc']
          const col = churchEvents[column] as AnySQLiteColumn
          return order === 'asc' ? asc(col) : desc(col)
        })
      )
      .limit(pageSize)
      .offset((page - 1) * pageSize)

    const selectedRows = rows as (InferSelectModel<typeof churchEvents> & { total: number })[]

    let total: number
    if (selectedRows.length > 0) {
      total = selectedRows[0].total
    } else {
      const countResult = await db
        .select({ churchEventsCount: count(churchEvents.slug) })
        .from(churchEvents)
        .where(whereClause)
      total = countResult[0].churchEventsCount
    }

    return {
      churchEvents: selectedRows.map(({ total: _total, ...event }) => event) as InferSelectModel<
        typeof churchEvents
      >[],
      total,
    }
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

    return db.query.churchEvents.findMany({
      columns,
      where: {
        startDate: { lt: monthEnd },
        AND: [
          {
            OR: [
              { endDate: { isNotNull: true, gte: monthStart } } as const,
              { endDate: { isNull: true }, startDate: { gte: monthStart } } as const,
            ],
          },
          ...(includeEndedEvents
            ? []
            : [
                {
                  OR: [{ endDate: { isNull: true } } as const, { endDate: { gte: new Date() } }],
                },
              ]),
        ],
      },
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
