import type { AnySQLiteColumn } from 'drizzle-orm/sqlite-core'
import { asc, count, desc, getColumns, like, sql } from 'drizzle-orm'
import { users } from '#server/db/schema'
import { BaseRepository } from './base.repository'

type UserSchemaKeys = keyof typeof users.$inferSelect

export type UsersColumns = {
  [K in UserSchemaKeys]?: boolean
}

const SORTABLE_COLUMNS: Record<string, AnySQLiteColumn> = {
  name: users.name,
  email: users.email,
  role: users.role,
  banned: users.banned,
  createdAt: users.createdAt,
  updatedAt: users.updatedAt,
}

class UserRepository extends BaseRepository<typeof users> {
  constructor() {
    super(undefined, users)
  }

  async findById(id: string) {
    return this.db.query.users.findFirst({ where: { id } })
  }

  async listForDashboard({
    search,
    limit,
    offset,
    sortBy,
    sortDirection,
  }: {
    search: string
    limit: number
    offset: number
    sortBy: string
    sortDirection: 'asc' | 'desc'
  }) {
    const orderByColumn = SORTABLE_COLUMNS[sortBy] ?? users.createdAt
    const orderBy = sortDirection === 'asc' ? asc(orderByColumn) : desc(orderByColumn)
    const whereClause = search ? like(users.name, `%${search}%`) : undefined

    const rows = await this.db
      .select({ ...getColumns(users), total: sql<number>`count(*) over ()`.mapWith(Number) })
      .from(users)
      .where(whereClause)
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset)

    const selectedRows = rows as (typeof users.$inferSelect & { total: number })[]

    let total: number
    if (selectedRows.length > 0) {
      total = selectedRows[0].total
    } else {
      const countResult = await this.db
        .select({ usersCount: count(users.id) })
        .from(users)
        .where(whereClause)
      total = countResult[0].usersCount
    }

    return {
      users: selectedRows.map(({ total: _total, ...user }) => user),
      total,
    }
  }
}

export const userRepository = new UserRepository()
