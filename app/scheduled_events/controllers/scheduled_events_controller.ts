import type { HttpContext } from '@adonisjs/core/http'
import ScheduledEvent from '#scheduled_events/models/scheduled_event'
import { DateTime } from 'luxon'
import ScheduledEventTransformer from '#scheduled_events/transformers/scheduled_event_transformer'
import { Exception } from '@adonisjs/core/exceptions'

export default class ScheduledEventsController {
  async index({ inertia, logger }: HttpContext) {
    try {
      const now = DateTime.now().toSQL()

      const data = await ScheduledEvent.query()
        .select(
          'id',
          'title',
          'slug',
          'description',
          'location',
          'cover_image_url',
          'registration_required',
          'max_participants',
          'start_date'
        )
        .where((query) => {
          query.whereNotNull('end_date').where('end_date', '>=', now)
        })
        .orWhere((query) => {
          query.whereNull('end_date').where('start_date', '>=', now)
        })
        .orderBy('start_date', 'asc')

      return inertia.render('events/all', {
        events: ScheduledEventTransformer.transform(data).useVariant('publicList'),
        error: false,
      })
    } catch (error) {
      logger.error({ err: error }, 'Failed to load events')
      return inertia.render('events/all', {
        events: [],
        error: true,
      })
    }
  }

  async single({ params, inertia }: HttpContext) {
    const { slug } = params

    const event = await ScheduledEvent.query()
      .select(
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
        'endDate'
      )
      .where('slug', slug)
      .first()

    if (!event) {
      throw new Exception('Not found', { status: 404 })
    }

    return inertia.render('events/single', {
      event: ScheduledEventTransformer.transform(event).useVariant('publicDetails'),
    })
  }
}
