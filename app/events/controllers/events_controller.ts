import type { HttpContext } from '@adonisjs/core/http'
import Event from '#events/models/event'
import { DateTime } from 'luxon'

export default class EventsController {
  async index({ inertia }: HttpContext) {
    const data = await Event.query()
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
      .orderBy('start_date', 'asc')
      .limit(4)

    return inertia.render('find/events', {
      events: data as Array<{
        id: number
        title: string
        slug: string
        description: string
        location: string
        coverImageUrl?: string
        registrationRequired: boolean
        maxParticipants?: number
        startDate: DateTime<boolean>
      }>,
    })
  }

  async single({ response, params, inertia }: HttpContext) {
    const { slug } = params

    const event = await Event.query()
      .select(
        'slug',
        'title',
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
      response.status(404)
      return inertia.render('errors/not_found')
    }

    return inertia.render('find/event_single', {
      event: event.toJSON(),
    })
  }
}
