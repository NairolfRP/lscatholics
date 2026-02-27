import type { HttpContext } from '@adonisjs/core/http'
import Post from '#posts/models/post'
import ScheduledEvent from '#scheduled_events/models/scheduled_event'
import User from '#users/models/user'

export default class DashboardController {
  async index({ inertia }: HttpContext) {
    const [articles, events, users] = await Promise.all([
      Post.query().count('* as total'),
      ScheduledEvent.query().count('* as total'),
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
