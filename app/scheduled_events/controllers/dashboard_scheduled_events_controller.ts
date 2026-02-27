import type { HttpContext } from '@adonisjs/core/http'
import ScheduledEvent from '#scheduled_events/models/scheduled_event'
import {
  createDashboardScheduledEventValidator,
  updateDashboardScheduledEventValidator,
} from '#scheduled_events/validators/dashboard_scheduled_event'
import ScheduledEventTransformer from '#scheduled_events/transformers/scheduled_event_transformer'

export default class DashboardScheduledEventsController {
  async index({ inertia, request, bouncer }: HttpContext) {
    await bouncer.with('ScheduledEventPolicy').authorize('viewDashboard')

    let page = request.input('page', 1)
    const limit = request.input('limit', 10)

    if (page <= 0) {
      page = 1
    }

    let query = ScheduledEvent.query()
      .select('id', 'title', 'location', 'startDate', 'maxParticipants')
      .orderBy('start_date', 'desc')

    const events = await query.paginate(page, limit)

    return inertia.render('dashboard/events/index', {
      events: ScheduledEventTransformer.paginate(events.all(), events.getMeta()),
    })
  }

  async create({ inertia, bouncer }: HttpContext) {
    await bouncer.with('ScheduledEventPolicy').authorize('create')

    return inertia.render('dashboard/events/create', {})
  }

  async store({ request, response, bouncer }: HttpContext) {
    await bouncer.with('ScheduledEventPolicy').authorize('create')

    const payload = await request.validateUsing(createDashboardScheduledEventValidator)

    const event = await ScheduledEvent.create(payload)

    return response.redirect().toRoute('dashboard.dashboard_events.show', { id: event.id })
  }

  async show({ inertia, params, bouncer }: HttpContext) {
    await bouncer.with('ScheduledEventPolicy').authorize('viewDashboard')

    const event = await ScheduledEvent.findOrFail(params.id)

    return inertia.render('dashboard/events/show', {
      event: ScheduledEventTransformer.transform(event).useVariant('allFields'),
    })
  }

  async edit({ inertia, params, bouncer }: HttpContext) {
    await bouncer.with('ScheduledEventPolicy').authorize('edit')

    const event = await ScheduledEvent.findOrFail(params.id)

    return inertia.render('dashboard/events/edit', {
      event: ScheduledEventTransformer.transform(event).useVariant('allFields'),
    })
  }

  async update({ request, response, params, bouncer }: HttpContext) {
    await bouncer.with('ScheduledEventPolicy').authorize('edit')

    const event = await ScheduledEvent.findOrFail(params.id)
    const payload = await request.validateUsing(updateDashboardScheduledEventValidator)

    await event.merge(payload).save()

    return response.redirect().toRoute('dashboard.dashboard_events.show', { id: event.id })
  }

  async destroy({ response, params, session, bouncer }: HttpContext) {
    await bouncer.with('ScheduledEventPolicy').authorize('delete')

    const event = await ScheduledEvent.findOrFail(params.id)
    await event.delete()

    session.flash('success', `L'événement '${event.title}' a été supprimé.`)

    return response.redirect().toRoute('dashboard.dashboard_events.index')
  }
}
