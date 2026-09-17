import type { AnySQLiteTable } from 'drizzle-orm/sqlite-core'
import { resolve } from 'node:path'
import { sql } from 'drizzle-orm'
import { SQLiteTable } from 'drizzle-orm/sqlite-core'
import { migrate } from 'drizzle-orm/tursodatabase/migrator'
import { db } from '#server/db'
import * as schema from '#server/db/schema'

const tables = Object.values(schema).filter(
  // @ts-expect-error Type checking fails because it's too generic and complicated to type
  (value): value is AnySQLiteTable => value instanceof SQLiteTable
)

export async function setupTestDb() {
  await migrate(db, { migrationsFolder: resolve(import.meta.dirname, '../../drizzle') })
}

export async function resetDb() {
  await db.run(sql`PRAGMA foreign_keys = OFF`)
  for (const table of tables) {
    await db.delete(table)
  }
  await db.run(sql`PRAGMA foreign_keys = ON`)
}
