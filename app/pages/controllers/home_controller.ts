import type { HttpContext } from '@adonisjs/core/http'
import News from '#news/models/news'

export default class HomeController {
  async index({ inertia, logger }: HttpContext) {
    return inertia.render('home', {
      posts: inertia.optional(async () => {
        try {
          return {
            data: await News.query()
              .select(
                'id',
                'slug',
                'title',
                'excerpt',
                'cover_image_url',
                'category',
                'publishedAt'
              )
              .where('status', 'published')
              .orderBy('publishedAt', 'desc')
              .limit(3),
            error: '',
          }
        } catch (error) {
          logger.error({ err: error }, 'Failed to get recent posts')

          return {
            data: [],
            error: 'Une erreur est survenue lors du chargement des récentes actualités',
          }
        }
      }),
    })
  }
}
