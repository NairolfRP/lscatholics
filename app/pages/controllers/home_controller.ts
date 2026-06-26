import type { HttpContext } from '@adonisjs/core/http'
import Post from '#posts/models/post'
import PostTransformer from '#posts/transformers/post_transformer'
import ScheduledEvent from '#scheduled_events/models/scheduled_event'
import { DateTime } from 'luxon'
import ScheduledEventTransformer from '#scheduled_events/transformers/scheduled_event_transformer'

export default class HomeController {
  async index({ inertia, logger }: HttpContext) {
    return inertia.render('home', {
      // @ts-ignore
      latestPosts: inertia.optional(() => this.#getLatestPosts(logger)),
      // @ts-ignore
      upcomingEvents: inertia.defer(() => this.#getUpcomingEvents(logger)),
    })
  }

  async #getUpcomingEvents(logger: HttpContext['logger']) {
    try {
      const now = DateTime.now().toSQL()

      const upcomingEvents = await ScheduledEvent.query()
        .select('slug', 'title', 'start_date')
        .where('start_date', '>=', now)
        .where((query) => {
          query.where('end_date', '>=', now).orWhereNull('end_date')
        })
        .orderBy('start_date', 'asc')
        .limit(3)

      return { data: ScheduledEventTransformer.transform(upcomingEvents).useVariant('home') }
    } catch (error) {
      logger.error({ err: error }, '[Home] Failed to get upcoming events')
      return {
        data: [],
        error: 'Une erreur est survenue lors du chargement des prochains événements.',
      }
    }
  }

  async #getLatestPosts(logger: HttpContext['logger']) {
    try {
      const posts = await Post.query()
        .select('id', 'slug', 'title', 'excerpt', 'cover_image_url', 'category', 'publishedAt')
        .where('status', 'published')
        .orderBy('publishedAt', 'desc')
        .limit(3)

      return {
        data: PostTransformer.transform(posts).useVariant('homePosts'),
      }
    } catch (error) {
      logger.error({ err: error }, 'Failed to get recent posts')

      return {
        data: [],
        error: 'Une erreur est survenue lors du chargement des récentes actualités',
      }
    }
  }
}
