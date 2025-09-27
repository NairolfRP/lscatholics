import type { HttpContext } from '@adonisjs/core/http'
import News from '#news/models/news'
import { DateTime } from 'luxon'

export default class HomeController {
  async index({ session, inertia, logger }: HttpContext) {
    try {
      const recentPosts = await News.query()
        .select('id', 'slug', 'title', 'excerpt', 'cover_image_url', 'category', 'publishedAt')
        .where('status', 'published')
        .orderBy('publishedAt', 'desc')
        .limit(3)

      return inertia.render('home', {
        posts: recentPosts as Array<{
          id: number
          slug: string
          title: string
          excerpt?: string
          coverImageUrl?: string
          category?: string
          publishedAt?: DateTime<boolean>
        }>,
      })
    } catch (error) {
      logger.error({ err: error }, 'Failed to get recent posts')

      session.flashErrors({
        E_HOME_RECENT_POSTS: 'Une erreur est survenue lors du chargement des récentes actualités',
      })

      return inertia.render('home', {
        posts: [],
      })
    }
  }
}
