import { relations, sql } from 'drizzle-orm'
import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { timestamps } from '#server/db/helpers.ts'
import { users } from '#server/db/schema/auth-schema.ts'
import { DEPARTMENT_VALUES } from '#shared/constants/department.ts'
import { EMPLOYMENT_TYPE_VALUES } from '#shared/constants/employment.ts'

export const jobPostings = sqliteTable(
  'job_postings',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),

    title: text('title', { length: 150 }).notNull(),
    slug: text('slug', { length: 150 }).notNull().unique(),
    description: text('description', { length: 2000 }),
    reportsTo: text('reports_to', { length: 100 }),
    department: text('department', { enum: DEPARTMENT_VALUES }).notNull(),
    responsibilities: text('responsibilities', { mode: 'json' })
      .$type<string[]>()
      .default(sql`(json_array())`),
    requirements: text('requirements', { mode: 'json' })
      .$type<string[]>()
      .default(sql`(json_array())`),
    skills: text('skills', { mode: 'json' })
      .$type<string[]>()
      .default(sql`(json_array())`),
    salaryMin: integer('salary_min'),
    salaryMax: integer('salary_max'),
    employmentType: text('employment_type', { enum: EMPLOYMENT_TYPE_VALUES }).notNull(),
    isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
    postedAt: integer('posted_at', { mode: 'timestamp_ms' }),
    expiresAt: integer('expires_at', { mode: 'timestamp_ms' }),

    ...timestamps(),

    authorId: text('author_id').references(() => users.id, { onDelete: 'set null' }),
  },
  (table) => [
    index('job_postings_department_idx').on(table.department),
    index('job_postings_employment_type_idx').on(table.employmentType),
    index('job_postings_active_idx').on(table.isActive),
    index('job_postings_expires_at_idx').on(table.expiresAt),
  ]
)

export const jobPostingsRelations = relations(jobPostings, ({ one }) => ({
  author: one(users, {
    fields: [jobPostings.authorId],
    references: [users.id],
  }),
}))
