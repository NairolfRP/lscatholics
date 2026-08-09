import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { timestamps } from '#server/db/helpers.ts'

export const pendingPayments = sqliteTable(
  'pending_payments',
  {
    id: text('id').primaryKey(),
    source: text('source').notNull(),
    amount: integer('amount').notNull(),
    mode: integer('mode').notNull().default(0),
    metadata: text('metadata').notNull().default(''),
    expiresAt: integer('expires_at', { mode: 'timestamp_ms' }).notNull(),
    ...timestamps(),
  },
  (table) => [index('pending_payments_expires_at_idx').on(table.expiresAt)]
)
