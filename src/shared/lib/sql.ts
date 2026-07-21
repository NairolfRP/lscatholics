import type { SQL } from 'drizzle-orm'
import type { AnySQLiteColumn } from 'drizzle-orm/sqlite-core'
import { sql } from 'drizzle-orm'

export function lower(column: AnySQLiteColumn): SQL {
  return sql`lower(${column})`
}
