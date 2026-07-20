import type { Table } from 'drizzle-orm'
import { and, count, eq, getTableColumns } from 'drizzle-orm'
import { db as dbClient } from '../db'

export class BaseRepository<TSchema extends Table> {
  constructor(
    protected db = dbClient,
    protected schema: TSchema
  ) {}

  async update(where: Partial<TSchema['$inferSelect']>, data: Partial<TSchema['$inferInsert']>) {
    const columns = getTableColumns(this.schema)

    const conditions = Object.entries(where).map(([key, value]) => {
      const column = columns[key]
      // oxlint-disable-next-line typescript/no-unnecessary-condition
      if (!column) throw new Error(`Column ${key} not found in schema`)

      return eq(column, value)
    })

    if (conditions.length === 0) {
      throw new Error("Update operation requires at least one condition in the 'where' clause.")
    }

    const sqlCondition = conditions.length === 1 ? conditions[0] : and(...conditions)

    return await this.db
      .update(this.schema)
      .set(data as any)
      .where(sqlCondition)
      .returning()
  }

  async getCount() {
    const result = await this.db.select({ count: count() }).from(this.schema)

    return result[0].count
  }
}
