import { sql } from 'drizzle-orm'
import { integer } from 'drizzle-orm/sqlite-core'

export const CURRENT_TIMESTAMP = sql`(cast(unixepoch('subsecond') * 1000 as integer))`

export function timestamps() {
  return {
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).default(CURRENT_TIMESTAMP).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
      .default(CURRENT_TIMESTAMP)
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  }
}
