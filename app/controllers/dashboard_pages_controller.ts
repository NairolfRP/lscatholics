import type { HttpContext } from '@adonisjs/core/http'
import News from '#models/news'
import Event from '#models/event'
import User from '#models/user'

export default class DashboardPagesController {
  async index({ inertia }: HttpContext) {
    const [articles, events, users] = await Promise.all([
      News.query().count('* as total'),
      Event.query().count('* as total'),
      User.query().count('* as total'),
    ])

    return inertia.render('dashboard/index', {
      stats: {
        articles: Number(articles[0].$extras.total),
        events: Number(events[0].$extras.total),
        users: Number(users[0].$extras.total),
      },
    })
  }
}
