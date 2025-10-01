import type { HttpContext } from '@adonisjs/core/http'
import News from '#news/models/news'
import { createNewsSearchParamsValidator } from '#news/validators/news'
import { errors } from '@vinejs/vine'

export const categories = [
  { id: 'parish-life', name: 'Vie paroissiale', color: '#3b82f6' },
  { id: 'education', name: 'Éducation', color: '#16a34a' },
  { id: 'events', name: 'Événements', color: '#f97316' },
  { id: 'religious', name: 'Spiritualité', color: '#9333ea' },
] as const

export default class NewsController {
  async index({ request, inertia }: HttpContext) {
    const searchParams = request.qs()
    let payload = searchParams as { page: number; category?: string | undefined }

    try {
      payload = await createNewsSearchParamsValidator.validate(searchParams)
    } catch (e) {
      if (e instanceof errors.E_VALIDATION_ERROR) {
        e.messages.map((msg: { field: string }) => {
          if (msg.field === 'page') {
            payload.page = 1
            return
          }

          if (msg.field === 'category') {
            payload.category = undefined
            return
          }
        })
      }
    }

    const { page = 1, category } = payload

    const limit = 6

    const columns = [
      'id',
      'slug',
      'title',
      'category',
      'excerpt',
      'coverImageUrl',
      'publishedAt',
    ] as const

    try {
      let data

      if (category) {
        data = await News.query()
          .select(...columns)
          .where('category', category)
          .orderBy('publishedAt', 'desc')
          .paginate(page, limit)
      } else {
        data = await News.query()
          .select(...columns)
          .where('status', 'published')
          .orderBy('publishedAt', 'desc')
          .paginate(page, limit)
      }

      return inertia.render('news/all', {
        articles: data.toJSON() as {
          meta: {
            total: number
            perPage: number
            currentPage: number
            lastPage: number
            firstPage: number
            firstPageUrl: string
            lastPageUrl: string
            nextPageUrl: string
            previousPageUrl: string
          }
          data: Array<{
            id: number
            title: string
            slug: string
            category: string
            excerpt: string | null
            coverImageUrl: string | null
            publishedAt: Date
          }>
        },
        selectedCategory: category ?? '',
        categories,
        error: false,
      })
    } catch (e) {
      return inertia.render('news/all', {
        articles: {
          meta: {
            total: 0,
            perPage: 0,
            currentPage: 0,
            lastPage: 0,
            firstPage: 0,
            firstPageUrl: '',
            lastPageUrl: '',
            nextPageUrl: '',
            previousPageUrl: '',
          },
          data: [],
        },
        selectedCategory: '',
        categories,
        error: true,
      })
    }
  }

  async single({ response, inertia, params }: HttpContext) {
    const { slug } = params

    const post = await News.query()
      .select(
        'slug',
        'title',
        'excerpt',
        'coverImageUrl',
        'category',
        'content',
        'publishedAt',
        'updatedAt',
        'status'
      )
      .where('slug', slug)
      .first()

    if (!post || post.status !== 'published') {
      response.status(404)
      return inertia.render('errors/not_found')
    }

    return inertia.render('news/single', {
      post: post.toJSON(),
    })
  }
}
