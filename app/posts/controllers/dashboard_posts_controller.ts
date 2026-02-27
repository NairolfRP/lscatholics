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

    const articles = await query.orderBy('created_at', 'desc').paginate(page, limit)

    return inertia.render('dashboard/articles/index', {
      articles: PostTransformer.paginate(articles.all(), articles.getMeta()),
      filters: { search },
    })
  }

  async create({ inertia, bouncer }: HttpContext) {
    await bouncer.with('PostPolicy').authorize('create')
    return inertia.render('dashboard/articles/create', {})
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

    const newArticle: Partial<Post> = {
      ...payload,
      excerpt,
      publishedAt,
    }

    const article = await Post.create({
      ...newArticle,
      authorId: (auth.user! as User).id,
    })

    return response.redirect().toRoute('dashboard.dashboard_articles.show', { id: article.id })
  }

  async show({ inertia, params, bouncer }: HttpContext) {
    await bouncer.with('PostPolicy').authorize('viewDashboard')

    const article = await Post.findOrFail(params.id)
    await article.loadOnce('author')

    return inertia.render('dashboard/articles/show', {
      article: PostTransformer.transform(article).useVariant('allFields'),
    })
  }

  async edit({ inertia, params, bouncer }: HttpContext) {
    await bouncer.with('PostPolicy').authorize('edit')

    const article = await Post.findOrFail(params.id)

    await article.loadOnce('author')

    return inertia.render('dashboard/articles/edit', {
      article: PostTransformer.transform(article).useVariant('allFields'),
    })
  }

  async update({ request, response, params, bouncer }: HttpContext) {
    await bouncer.with('PostPolicy').authorize('edit')

    const article = await Post.findOrFail(params.id)
    const payload = await request.validateUsing(updatedDashboardPostValidator)

    const excerpt = payload.excerpt?.trim()
      ? payload.excerpt
      : ExcerptGenerator.generate(payload.content || article.content, 150)

    const isStatusPublished = (payload.status || article.status) === 'published'

    let publishedAt = payload.publishedAt ? payload.publishedAt || article.publishedAt : null

    if (isStatusPublished && !payload.publishedAt && !article.publishedAt) {
      publishedAt = DateTime.now()
    }

    const updatedArticle = {
      ...payload,
      excerpt,
      publishedAt,
    }

    await article.merge(updatedArticle).save()

    return response.redirect().toRoute('dashboard.dashboard_articles.show', { id: article.id })
  }

  async destroy({ response, session, params, bouncer }: HttpContext) {
    await bouncer.with('PostPolicy').authorize('delete')

    const article = await Post.findOrFail(params.id)
    await article.delete()

    session.flash('success', `L'article '${article.title}' a été supprimé.`)

    return response.redirect().toRoute('dashboard.dashboard_articles.index')
  }
}
