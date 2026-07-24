import type { InferSelectModel } from 'drizzle-orm'
import type { churchEvents } from '#server/db/schema/church-event-schema'

export type ChurchEvent = InferSelectModel<typeof churchEvents>
