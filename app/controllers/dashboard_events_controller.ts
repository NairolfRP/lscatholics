import type { HttpContext } from '@adonisjs/core/http'
import Event from '#models/event'
import {
  createDashboardEventValidator,
  updateDashboardEventValidator,
} from '#validators/dashboard_event'
import EventTransformer from '#transformers/event_transformer'

export default class DashboardEventsController {
  async index({ inertia, request, bouncer }: HttpContext) {
    await bouncer.authorize('userAbility', 'manageEvents')

    let page = request.input('page', 1)
    const limit = request.input('limit', 10)

    if (page <= 0) {
      page = 1
    }

    let query = Event.query()
      .select('id', 'title', 'location', 'startDate', 'maxParticipants')
      .orderBy('start_date', 'desc')

    const events = await query.paginate(page, limit)

    return inertia.render('dashboard/events/index', {
      events: EventTransformer.paginate(events.all(), events.getMeta()),
    })
  }

  async create({ inertia, bouncer }: HttpContext) {
    await bouncer.authorize('userAbility', 'manageEvents')

    return inertia.render('dashboard/events/create', {})
  }

  async store({ request, response, bouncer }: HttpContext) {
    await bouncer.authorize('userAbility', 'manageEvents')

    const payload = await request.validateUsing(createDashboardEventValidator)

    const event = await Event.create(payload)

    return response.redirect().toRoute('dashboard.dashboard_events.show', { id: event.id })
  }

  async show({ inertia, params, bouncer }: HttpContext) {
    await bouncer.authorize('userAbility', 'manageEvents')

    const event = await Event.findOrFail(params.id)

    return inertia.render('dashboard/events/show', {
      event: EventTransformer.transform(event).useVariant('allFields'),
    })
  }

  async edit({ inertia, params, bouncer }: HttpContext) {
    await bouncer.authorize('userAbility', 'manageEvents')

    const event = await Event.findOrFail(params.id)

    return inertia.render('dashboard/events/edit', {
      event: EventTransformer.transform(event).useVariant('allFields'),
    })
  }

  async update({ request, response, params, bouncer }: HttpContext) {
    await bouncer.authorize('userAbility', 'manageEvents')

    const event = await Event.findOrFail(params.id)
    const payload = await request.validateUsing(updateDashboardEventValidator)

    await event.merge(payload).save()

    return response.redirect().toRoute('dashboard.dashboard_events.show', { id: event.id })
  }

  async destroy({ response, params, session, bouncer }: HttpContext) {
    await bouncer.authorize('userAbility', 'manageEvents')

    const event = await Event.findOrFail(params.id)
    await event.delete()

    session.flash('success', `L'événement '${event.title}' a été supprimé.`)

    return response.redirect().toRoute('dashboard.dashboard_events.index')
  }
}
