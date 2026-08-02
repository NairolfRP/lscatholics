import { sql } from 'drizzle-orm'
import { type AnySQLiteTable, SQLiteTable } from 'drizzle-orm/sqlite-core'
import { db } from '#server/db'
import * as schema from '#server/db/schema'

const tables = Object.values(schema).filter(
  // @ts-ignore
  (value): value is AnySQLiteTable => value instanceof SQLiteTable
)

export async function setupTestDb() {
  const { pushSQLiteSchema } = await import('drizzle-kit/api')
  const { apply } = await pushSQLiteSchema(schema, db)
  await apply()
}

export async function resetDb() {
  await db.run(sql`PRAGMA foreign_keys = OFF`)
  for (const table of tables) {
    // @ts-ignore
    await db.delete(table)
  }
  await db.run(sql`PRAGMA foreign_keys = ON`)
}
