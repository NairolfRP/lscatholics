import { churchEvents } from '../db/schema'
import { BaseRepository } from './base.repository'

type EventsColumns = {
  [K in keyof typeof churchEvents.$inferSelect]?: boolean
}

class ChurchEventRepository extends BaseRepository<typeof churchEvents> {
  constructor() {
    super(undefined, churchEvents)
  }

  async findLatest<TColumns extends EventsColumns>(limit: number, columns: TColumns) {
    return this.db.query.churchEvents.findMany({
      limit,
      columns,
      orderBy: (schema, { asc }) => [asc(schema.startDate)],
      where: (schema, { and, gte }) =>
        and(gte(schema.startDate, new Date()), gte(schema.endDate, new Date())),
    })
  }
}

export const churchEventRepository = new ChurchEventRepository()
