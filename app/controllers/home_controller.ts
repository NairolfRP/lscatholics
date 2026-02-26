import type { HttpContext } from '@adonisjs/core/http'
import News from '#models/news'
import NewsTransformer from '#transformers/news_transformer'

export default class HomeController {
  async index({ inertia, logger }: HttpContext) {
    return inertia.render('home', {
      // @ts-ignore
      posts: inertia.optional(async () => {
        try {
          const articles = await News.query()
            .select('id', 'slug', 'title', 'excerpt', 'cover_image_url', 'category', 'publishedAt')
            .where('status', 'published')
            .orderBy('publishedAt', 'desc')
            .limit(3)

          return {
            data: NewsTransformer.transform(articles).useVariant('homePosts'),
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
