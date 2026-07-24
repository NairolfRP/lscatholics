import type { ResultSet } from '@libsql/client/web'
import type { Table } from 'drizzle-orm'
import { and, count, eq, getTableColumns } from 'drizzle-orm'
import { db as dbClient } from '../db'

type CreateResult<
  TSchema extends Table,
  TReturning extends boolean | readonly (keyof TSchema['$inferSelect'])[] | undefined,
> = TReturning extends true
  ? TSchema['$inferSelect'][]
  : TReturning extends readonly (keyof TSchema['$inferSelect'])[]
    ? Pick<TSchema['$inferSelect'], TReturning[number]>[]
    : ResultSet

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
      .set(data as Record<string, unknown>)
      .where(sqlCondition)
      .returning()
  }

  async create<
    TReturning extends boolean | readonly (keyof TSchema['$inferSelect'])[] | undefined = undefined,
  >(
    data: TSchema['$inferInsert'],
    options?: { returning?: TReturning }
  ): Promise<
    TReturning extends true
      ? TSchema['$inferSelect'][]
      : TReturning extends readonly (keyof TSchema['$inferSelect'])[]
        ? Pick<TSchema['$inferSelect'], TReturning[number]>[]
        : ResultSet
  > {
    const returning = options?.returning
    const query = this.db.insert(this.schema).values(data)

    if (returning) {
      const returningFields =
        Array.isArray(returning) && returning.length > 0
          ? returning.reduce(
              (selectedFields, field) => {
                selectedFields[field as keyof TSchema['$inferSelect']] =
                  this.schema[field as keyof typeof this.schema]
                return selectedFields
              },
              {} as Record<string, unknown>
            )
          : undefined
      return (await query.returning(returningFields)) as unknown as CreateResult<
        TSchema,
        TReturning
      >
    }

    return (await query) as unknown as CreateResult<TSchema, TReturning>
  }

  async getCount() {
    const result = await this.db.select({ count: count() }).from(this.schema)

    return result[0].count
  }
}
