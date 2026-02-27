import { ScheduledEventSchema } from '#database/schema'

export default class ScheduledEvent extends ScheduledEventSchema {
  public static table = 'scheduled_events'
}
