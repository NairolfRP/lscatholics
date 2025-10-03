import type { HttpContext } from '@adonisjs/core/http'
import News from '#news/models/news'
import { createArticleValidator, updatedArticleValidator } from '#dashboard/validators/article'
import { DateTime } from 'luxon'
import type User from '#auth/models/user'

export default class ArticlesController {
  async index({ inertia, request, bouncer }: HttpContext) {
    await bouncer.authorize('userAbility', 'viewArticles')

    const search = request.input('search', '')
    let page = request.input('page', 1)
    const limit = request.input('limit', 10)

    if (page <= 0) {
      page = 1
    }

    let query = News.query().select('id', 'title', 'createdAt', 'status', 'authorId')

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
      articles: articles.serialize(),
      filters: { search },
    })
  }

  async create({ inertia, bouncer }: HttpContext) {
    await bouncer.authorize('userAbility', 'createArticles')
    return inertia.render('dashboard/articles/create')
  }

  async store({ request, response, auth, bouncer }: HttpContext) {
    await bouncer.authorize('userAbility', 'createArticles')

    const payload = await request.validateUsing(createArticleValidator)

    const newArticle = {
      ...payload,
      publishedAt: payload.publishedAt ? DateTime.fromJSDate(payload.publishedAt) : undefined,
    }

    const article = await News.create({
      ...newArticle,
      authorId: (auth.user! as User).id,
    })

    return response.redirect().toRoute('dashboard.dashboard_articles.show', { id: article.id })
  }

  async show({ inertia, params, bouncer }: HttpContext) {
    await bouncer.authorize('userAbility', 'viewArticles')

    const article = await News.findOrFail(params.id)
    await article.load('author')

    return inertia.render('dashboard/articles/show', {
      article: article.serialize(),
    })
  }

  async edit({ inertia, params, bouncer }: HttpContext) {
    await bouncer.authorize('userAbility', 'editArticles')

    const article = await News.findOrFail(params.id)

    return inertia.render('dashboard/articles/edit', {
      article: article.serialize(),
    })
  }

  async update({ request, response, params, bouncer }: HttpContext) {
    await bouncer.authorize('userAbility', 'editArticles')

    const article = await News.findOrFail(params.id)
    const payload = await request.validateUsing(updatedArticleValidator)

    const updatedArticle = {
      ...payload,
      publishedAt: payload.publishedAt ? DateTime.fromJSDate(payload.publishedAt) : undefined,
    }

    await article.merge(updatedArticle).save()

    return response.redirect().toRoute('dashboard.dashboard_articles.show', { id: article.id })
  }

  async destroy({ response, session, params, bouncer }: HttpContext) {
    await bouncer.authorize('userAbility', 'deleteArticles')

    const article = await News.findOrFail(params.id)
    await article.delete()

    session.flash('success', `L'article '${article.title}' a été supprimé.`)

    return response.redirect().toRoute('dashboard.dashboard_articles.index')
  }
}
