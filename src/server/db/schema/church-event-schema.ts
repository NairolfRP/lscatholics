import { createId } from '@paralleldrive/cuid2'
import { relations, sql } from 'drizzle-orm'
import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { PARISH_VALUES } from '#/shared/constants/parish'
import { users } from './auth-schema'

export const churchEvents = sqliteTable(
  'church_events',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
    title: text('title').notNull(),
    slug: text('slug').notNull().unique(),
    description: text('description').notNull(),
    content: text('content').notNull(),
    location: text('location').notNull(),
    parish: text('parish', { enum: PARISH_VALUES }),
    coverImageUrl: text('cover_image_url').notNull(),
    flyerUrl: text('flyer_url'),
    registrationRequired: integer('registration_required', { mode: 'boolean' }).default(false),
    maxParticipants: integer('max_participants'),
    startDate: integer('start_date', { mode: 'timestamp_ms' }).notNull(),
    endDate: integer('end_date', { mode: 'timestamp_ms' }),
    createdAt: integer('created_at', { mode: 'timestamp_ms' })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    authorId: text('author_id').references(() => users.id, { onDelete: 'set null' }),
  },
  (table) => [
    index('church_events_parish_idx').on(table.parish),
    index('church_events_start_date_idx').on(table.startDate),
    index('church_events_end_date_idx').on(table.endDate),
    index('church_events_author_id_idx').on(table.authorId),
  ]
)

export const churchEventsRelations = relations(churchEvents, ({ one }) => ({
  users: one(users, {
    fields: [churchEvents.authorId],
    references: [users.id],
  }),
}))
