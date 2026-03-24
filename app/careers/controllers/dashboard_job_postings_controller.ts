import type { HttpContext } from '@adonisjs/core/http'
import JobPosting from '#careers/models/job_posting'
import { DateTime } from 'luxon'
import {
  createDashboardJobPostingValidator,
  updatedDashboardJobPostingValidator,
} from '#careers/validators/dashboard_job_posting'
import JobPostingTransformer from '#careers/transformers/job_posting_transformer'

export default class DashboardJobPostingsController {
  async index({ inertia, request, bouncer }: HttpContext) {
    await bouncer.with('CareersJobPostingPolicy').authorize('viewDashboard')

    const search = request.input('search', '')
    let page = request.input('page', 1)
    const limit = request.input('limit', 10)

    if (page <= 0) {
      page = 1
    }

    let query = JobPosting.query().select('id', 'title', 'is_active', 'postedAt')

    if (search) {
      query = query.where((builder) => {
        builder
          .whereRaw('LOWER(title) LIKE ?', [`%${search.toLowerCase()}%`])
          .orWhereRaw('LOWER(summary) LIKE ?', [`%${search.toLowerCase()}%`])
      })
    }

    const jobs = await query.orderBy('created_at', 'desc').paginate(page, limit)

    return inertia.render('dashboard/jobs/index', {
      jobs: JobPostingTransformer.paginate(jobs.all(), jobs.getMeta()),
      filters: { search },
    })
  }

  async create({ inertia, bouncer }: HttpContext) {
    await bouncer.with('CareersJobPostingPolicy').authorize('create')
    return inertia.render('dashboard/jobs/create', {})
  }

  async store({ request, response, bouncer }: HttpContext) {
    await bouncer.with('CareersJobPostingPolicy').authorize('create')

    const payload = await request.validateUsing(createDashboardJobPostingValidator)

    let postedAt: JobPosting['postedAt'] = payload.postedAt || null

    if (payload.isActive && !payload.postedAt) {
      postedAt = DateTime.now()
    }

    const newJob: Partial<JobPosting> = {
      ...payload,
      postedAt,
    }

    const job = await JobPosting.create({
      ...newJob,
    })

    return response.redirect().toRoute('dashboard.dashboard_jobs.show', { id: job.id })
  }

  async show({ inertia, params, bouncer }: HttpContext) {
    await bouncer.with('CareersJobPostingPolicy').authorize('viewDashboard')

    const job = await JobPosting.findOrFail(params.id)

    return inertia.render('dashboard/jobs/show', {
      job: JobPostingTransformer.transform(job).useVariant('allFields'),
    })
  }

  async edit({ inertia, params, bouncer }: HttpContext) {
    await bouncer.with('CareersJobPostingPolicy').authorize('edit')

    const job = await JobPosting.findOrFail(params.id)

    return inertia.render('dashboard/jobs/edit', {
      job: JobPostingTransformer.transform(job).useVariant('allFields'),
    })
  }

  async update({ request, response, params, bouncer }: HttpContext) {
    await bouncer.with('CareersJobPostingPolicy').authorize('edit')

    const job = await JobPosting.findOrFail(params.id)
    const payload = await request.validateUsing(
      updatedDashboardJobPostingValidator({ currentSlug: job.slug })
    )

    let postedAt: JobPosting['postedAt'] = payload.postedAt || null

    if (payload.isActive && !payload.postedAt && !job.postedAt) {
      postedAt = DateTime.now()
    }

    const updatedJob = {
      ...payload,
      postedAt,
    }

    await job.merge(updatedJob).save()

    return response.redirect().toRoute('dashboard.dashboard_jobs.show', { id: job.id })
  }

  async destroy({ response, session, params, bouncer }: HttpContext) {
    await bouncer.with('CareersJobPostingPolicy').authorize('delete')

    const job = await JobPosting.findOrFail(params.id)
    await job.delete()

    session.flash('success', `L'offre d'emploi '${job.title}' a été supprimée.`)

    return response.redirect().toRoute('dashboard.dashboard_jobs.index')
  }
}
