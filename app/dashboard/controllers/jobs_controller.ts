import type { HttpContext } from '@adonisjs/core/http'
import Job from '#pages/models/job'
import { DateTime } from 'luxon'
import { createJobValidator, updatedJobValidator } from '#dashboard/validators/job'

export default class JobsController {
  async index({ inertia, request, bouncer }: HttpContext) {
    await bouncer.authorize('userAbility', 'viewJobs')

    const search = request.input('search', '')
    let page = request.input('page', 1)
    const limit = request.input('limit', 10)

    if (page <= 0) {
      page = 1
    }

    let query = Job.query().select('id', 'title', 'is_active', 'postedAt')

    if (search) {
      query = query.where((builder) => {
        builder
          .whereILike('title', `%${search}%`)
          .orWhereILike('content', `%${search}%`)
          .orWhereILike('excerpt', `%${search}%`)
      })
    }

    const jobs = await query.orderBy('created_at', 'desc').paginate(page, limit)

    return inertia.render('dashboard/jobs/index', {
      jobs: jobs.serialize(),
      filters: { search },
    })
  }

  async create({ inertia, bouncer }: HttpContext) {
    await bouncer.authorize('userAbility', 'createJobs')
    return inertia.render('dashboard/jobs/create')
  }

  async store({ request, response, bouncer }: HttpContext) {
    await bouncer.authorize('userAbility', 'createJobs')

    const payload = await request.validateUsing(createJobValidator)

    let postedAt: Job['postedAt'] = payload.postedAt || null

    if (payload.isActive && !payload.postedAt) {
      postedAt = DateTime.now()
    }

    const newJob: Partial<Job> = {
      ...payload,
      postedAt,
    }

    const job = await Job.create({
      ...newJob,
    })

    return response.redirect().toRoute('dashboard.dashboard_jobs.show', { id: job.id })
  }

  async show({ inertia, params, bouncer }: HttpContext) {
    await bouncer.authorize('userAbility', 'viewJobs')

    const job = await Job.findOrFail(params.id)

    return inertia.render('dashboard/jobs/show', {
      job: job.serialize(),
    })
  }

  async edit({ inertia, params, bouncer }: HttpContext) {
    await bouncer.authorize('userAbility', 'editJobs')

    const job = await Job.findOrFail(params.id)

    return inertia.render('dashboard/jobs/edit', {
      job: job.serialize(),
    })
  }

  async update({ request, response, params, bouncer }: HttpContext) {
    await bouncer.authorize('userAbility', 'editJobs')

    const job = await Job.findOrFail(params.id)
    const payload = await request.validateUsing(updatedJobValidator)

    let postedAt: Job['postedAt'] = payload.postedAt || null

    if (payload.isActive && !payload.postedAt && !job.postedAt) {
      postedAt = DateTime.now()
    }

    const updatedArticle = {
      ...payload,
      postedAt,
    }

    await job.merge(updatedArticle).save()

    return response.redirect().toRoute('dashboard.dashboard_jobs.show', { id: job.id })
  }

  async destroy({ response, session, params, bouncer }: HttpContext) {
    await bouncer.authorize('userAbility', 'deleteJobs')

    const job = await Job.findOrFail(params.id)
    await job.delete()

    session.flash('success', `L'offre d'emploi '${job.title}' a été supprimée.`)

    return response.redirect().toRoute('dashboard.dashboard_jobs.index')
  }
}
