import type { HttpContext } from '@adonisjs/core/http'
import Post from '#posts/models/post'
import { createPostSearchParamsValidator } from '#posts/validators/post'
import { errors } from '@vinejs/vine'
import PostTransformer from '#posts/transformers/post_transformer'
import { Exception } from '@adonisjs/core/exceptions'

export const categories = [
  { id: 'parish-life', name: 'Vie paroissiale', color: '#3b82f6' },
  { id: 'education', name: 'Éducation', color: '#16a34a' },
  { id: 'events', name: 'Événements', color: '#f97316' },
  { id: 'religious', name: 'Spiritualité', color: '#9333ea' },
]

export default class PostsController {
  async index({ request, inertia }: HttpContext) {
    const searchParams = request.qs()
    let payload = searchParams as { page: number; category?: string | undefined }

    try {
      payload = await createPostSearchParamsValidator.validate(searchParams)
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
        data = await Post.query()
          .select(...columns)
          .where('category', category)
          .orderBy('publishedAt', 'desc')
          .paginate(page, limit)
      } else {
        data = await Post.query()
          .select(...columns)
          .where('status', 'published')
          .orderBy('publishedAt', 'desc')
          .paginate(page, limit)
      }

      return inertia.render('news/all', {
        articles: PostTransformer.paginate(data.all(), data.getMeta()).useVariant('publicList'),
        selectedCategory: category ?? '',
        categories,
        error: false,
      })
    } catch (e) {
      return inertia.render('news/all', {
        articles: {
          metadata: {
            total: 0,
            perPage: 0,
            currentPage: 0,
            lastPage: 0,
            firstPage: 0,
          },
          data: [],
        },
        selectedCategory: '',
        categories,
        error: true,
      })
    }
  }

  async single({ inertia, params }: HttpContext) {
    const { slug } = params

    const post = await Post.query()
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
      throw new Exception('Not found', { status: 404 })
    }

    return inertia.render('news/single', {
      post: PostTransformer.transform(post).useVariant('publicDetails'),
    })
  }
}
