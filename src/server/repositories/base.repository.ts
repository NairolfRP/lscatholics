import type { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import type { AnySQLiteTable, SQLiteInsertValue } from 'drizzle-orm/sqlite-core'
import type { TursoDatabaseServerlessRunResult } from 'drizzle-orm/tursodatabase-serverless'
import { and, count, eq, getTableColumns } from 'drizzle-orm'
import { db as dbClient } from '../db'

type CreateResult<
  TSchema extends AnySQLiteTable,
  TReturning extends boolean | readonly (keyof InferSelectModel<TSchema>)[] | undefined,
> = TReturning extends true
  ? InferSelectModel<TSchema>[]
  : TReturning extends readonly (keyof InferSelectModel<TSchema>)[]
    ? Pick<InferSelectModel<TSchema>, TReturning[number]>[]
    : TursoDatabaseServerlessRunResult

export class BaseRepository<TSchema extends AnySQLiteTable> {
  constructor(
    protected db = dbClient,
    protected schema: TSchema
  ) {}

  async update(
    where: Partial<InferSelectModel<TSchema>>,
    data: Partial<InferInsertModel<TSchema>>
  ) {
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

    return await this.db.update(this.schema).set(data).where(sqlCondition).returning()
  }

  async create<
    TReturning extends boolean | readonly (keyof InferSelectModel<TSchema>)[] | undefined =
      undefined,
  >(
    data: InferInsertModel<TSchema>,
    options?: { returning?: TReturning }
  ): Promise<
    TReturning extends true
      ? InferSelectModel<TSchema>[]
      : TReturning extends readonly (keyof InferSelectModel<TSchema>)[]
        ? Pick<InferSelectModel<TSchema>, TReturning[number]>[]
        : TursoDatabaseServerlessRunResult
  > {
    const returning = options?.returning
    const query = this.db.insert(this.schema).values(data as unknown as SQLiteInsertValue<TSchema>)

    if (returning) {
      const returningFields =
        Array.isArray(returning) && returning.length > 0
          ? returning.reduce(
              (selectedFields, field) => {
                selectedFields[field as keyof InferSelectModel<TSchema>] =
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

    return await query
  }

  async getCount() {
    const result = await this.db.select({ count: count() }).from(this.schema)

    return result[0].count
  }
}
