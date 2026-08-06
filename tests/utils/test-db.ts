import type { AnySQLiteTable } from 'drizzle-orm/sqlite-core'
import { SQLiteTable } from 'drizzle-orm/sqlite-core'
import { sql } from 'drizzle-orm'
import { db } from '#server/db'
import * as schema from '#server/db/schema'

const tables = Object.values(schema).filter(
  // @ts-expect-error Type checking fails because it's too generic and complicated to type
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
    // @ts-expect-error See table() - same reason
    await db.delete(table)
  }
  await db.run(sql`PRAGMA foreign_keys = ON`)
}
