import { ScheduledEventSchema } from '#database/schema'
import { column } from '@adonisjs/lucid/orm'

export default class ScheduledEvent extends ScheduledEventSchema {
  public static table = 'scheduled_events'

  @column({
    consume: (value) => !!value,
  })
  declare registrationRequired: boolean | null
}
