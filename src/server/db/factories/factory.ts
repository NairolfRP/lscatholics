import type { Table } from 'drizzle-orm'
import { Faker, faker as fakerJS } from '@faker-js/faker'
import { db as dbClient } from '#/server/db'

type DefineCallback<TSchema extends Table> = (context: {
  schema: TSchema
  faker: Faker
}) => TSchema['$inferInsert']

type InsertOptions = {
  chunkSize?: number
}

export class Factory<TSchema extends Table> {
  constructor(
    protected schema: TSchema,
    protected definition: DefineCallback<TSchema>,
    protected db = dbClient,
    protected faker: Faker = fakerJS
  ) {}

  static define<TSchema extends Table>(
    schema: TSchema,
    callback: DefineCallback<TSchema>
  ): Factory<TSchema> {
    return new Factory(schema, callback)
  }

  make(nb: number = 1): Array<TSchema['$inferInsert']> {
    return Array.from({ length: nb }, () =>
      this.definition({ schema: this.schema, faker: this.faker })
    )
  }

  makeOne(): TSchema['$inferInsert'] {
    return this.make(1)[0]
  }

  async insert(nb: number = 1, { chunkSize = 1000 }: InsertOptions = {}): Promise<void> {
    const values = this.make(nb)

    for (let i = 0; i < values.length; i += chunkSize) {
      await this.db
        .insert(this.schema)
        .values(values.slice(i, i + chunkSize))
        .onConflictDoNothing()
    }
  }

  override(overrides: Partial<TSchema['$inferInsert']>): Factory<TSchema> {
    return new Factory(
      this.schema,
      (ctx) => ({ ...this.definition(ctx), ...overrides }),
      this.db,
      this.faker
    )
  }

  withLocale(locale: ConstructorParameters<typeof Faker>[0]['locale']): Factory<TSchema> {
    return new Factory(this.schema, this.definition, this.db, new Faker({ locale }))
  }
}
