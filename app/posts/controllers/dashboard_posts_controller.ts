import type { HttpContext } from '@adonisjs/core/http'
import Post from '#posts/models/post'
import {
  createDashboardPostValidator,
  updatedDashboardPostValidator,
} from '#posts/validators/dashboard_post'
import { DateTime } from 'luxon'
import type User from '#users/models/user'
import { ExcerptGenerator } from '#core/utils/excerpt_generator'
import PostTransformer from '#posts/transformers/post_transformer'

export default class DashboardPostsController {
  async index({ inertia, request, bouncer }: HttpContext) {
    await bouncer.with('PostPolicy').authorize('viewDashboard')

    const search = request.input('search', '')
    let page = request.input('page', 1)
    const limit = request.input('limit', 10)

    if (page <= 0) {
      page = 1
    }

    let query = Post.query().select('id', 'title', 'createdAt', 'status', 'authorId')

    if (search) {
      query = query.where((builder) => {
        builder
          .whereILike('title', `%${search}%`)
          .orWhereILike('content', `%${search}%`)
          .orWhereILike('excerpt', `%${search}%`)
      })
    }

    const posts = await query.orderBy('created_at', 'desc').paginate(page, limit)

    return inertia.render('dashboard/posts/index', {
      posts: PostTransformer.paginate(posts.all(), posts.getMeta()),
      filters: { search },
    })
  }

  async create({ inertia, bouncer }: HttpContext) {
    await bouncer.with('PostPolicy').authorize('create')
    return inertia.render('dashboard/posts/create', {})
  }

  async store({ request, response, auth, bouncer }: HttpContext) {
    await bouncer.with('PostPolicy').authorize('create')

    const payload = await request.validateUsing(createDashboardPostValidator)

    const excerpt = payload.excerpt?.trim()
      ? payload.excerpt
      : ExcerptGenerator.generate(payload.content, 150)

    const isStatusPublished = payload.status === 'published'

    let publishedAt: Post['publishedAt'] = payload.publishedAt ? payload.publishedAt : null

    if (isStatusPublished && !payload.publishedAt) {
      publishedAt = DateTime.now()
    }

    const newPost: Partial<Post> = {
      ...payload,
      excerpt,
      publishedAt,
    }

    const post = await Post.create({
      ...newPost,
      authorId: (auth.user! as User).id,
    })

    return response.redirect().toRoute('dashboard.dashboard_posts.show', { id: post.id })
  }

  async show({ inertia, params, bouncer }: HttpContext) {
    await bouncer.with('PostPolicy').authorize('viewDashboard')

    const post = await Post.findOrFail(params.id)
    await post.loadOnce('author')

    return inertia.render('dashboard/posts/show', {
      post: PostTransformer.transform(post).useVariant('allFields'),
    })
  }

  async edit({ inertia, params, bouncer }: HttpContext) {
    await bouncer.with('PostPolicy').authorize('edit')

    const post = await Post.findOrFail(params.id)

    await post.loadOnce('author')

    return inertia.render('dashboard/posts/edit', {
      post: PostTransformer.transform(post).useVariant('allFields'),
    })
  }

  async update({ request, response, params, bouncer }: HttpContext) {
    await bouncer.with('PostPolicy').authorize('edit')

    const post = await Post.findOrFail(params.id)
    const payload = await request.validateUsing(updatedDashboardPostValidator)

    const excerpt = payload.excerpt?.trim()
      ? payload.excerpt
      : ExcerptGenerator.generate(payload.content || post.content, 150)

    const isStatusPublished = (payload.status || post.status) === 'published'

    let publishedAt = payload.publishedAt ? payload.publishedAt || post.publishedAt : null

    if (isStatusPublished && !payload.publishedAt && !post.publishedAt) {
      publishedAt = DateTime.now()
    }

    const updatedPost = {
      ...payload,
      excerpt,
      publishedAt,
    }

    await post.merge(updatedPost).save()

    return response.redirect().toRoute('dashboard.dashboard_posts.show', { id: post.id })
  }

  async destroy({ response, session, params, bouncer }: HttpContext) {
    await bouncer.with('PostPolicy').authorize('delete')

    const post = await Post.findOrFail(params.id)
    await post.delete()

    session.flash('success', `L'article '${post.title}' a été supprimé.`)

    return response.redirect().toRoute('dashboard.dashboard_posts.index')
  }
}
