import { BaseTransformer } from '@adonisjs/core/transformers'
import type ScheduledEvent from '#scheduled_events/models/scheduled_event'

export default class ScheduledEventTransformer extends BaseTransformer<ScheduledEvent> {
  toObject() {
    return this.pick(this.resource, ['id', 'title', 'location', 'startDate', 'maxParticipants'])
  }

  allFields() {
    return this.pick(this.resource, [
      'id',
      'title',
      'slug',
      'description',
      'content',
      'location',
      'parishId',
      'coverImageUrl',
      'flyerUrl',
      'registrationRequired',
      'maxParticipants',
      'startDate',
      'endDate',
      'createdAt',
      'updatedAt',
    ])
  }

  publicDetails() {
    return this.pick(this.resource, [
      'slug',
      'title',
      'description',
      'content',
      'location',
      'coverImageUrl',
      'flyerUrl',
      'registrationRequired',
      'maxParticipants',
      'startDate',
      'endDate',
    ])
  }

  publicList() {
    return this.pick(this.resource, [
      'id',
      'title',
      'slug',
      'description',
      'location',
      'coverImageUrl',
      'registrationRequired',
      'maxParticipants',
      'startDate',
    ])
  }

  home() {
    return this.pick(this.resource, ['slug', 'title', 'startDate'])
  }
}
