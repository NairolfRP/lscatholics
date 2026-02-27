import type { HttpContext } from '@adonisjs/core/http'
import JobPosting from '#careers/models/job_posting'
import { DateTime } from 'luxon'
import { Exception } from '@adonisjs/core/exceptions'
import JobPostingTransformer from '#careers/transformers/job_posting_transformer'

export default class JobPostingsController {
  async index({ request, inertia }: HttpContext) {
    let page = Math.max(1, Number(request.input('page', 1)) || 1)
    const perPage = Math.min(Math.max(1, Number(request.input('perPage', 10)) || 10), 50)

    const search = request.input('search', '')
    const departments = Array.isArray(request.input('departments'))
      ? request.input('departments')
      : request.input('departments')
        ? request.input('departments').split(',')
        : []
    const employmentTypes = Array.isArray(request.input('employmentTypes'))
      ? request.input('employmentTypes')
      : request.input('employmentTypes')
        ? request.input('employmentTypes').split(',')
        : []

    try {
      const total = await JobPosting.query().count('* as count').where('is_active', true)
      const lastPage = Math.max(1, Math.ceil(Number(total[0].$extras.count) / perPage))

      if (page > lastPage) page = 1

      const query = JobPosting.query()
        .select('id', 'slug', 'title', 'department', 'posted_at')
        .orderBy('posted_at', 'desc')
        .where('is_active', true)

      if (search) {
        query.where((builder) => {
          builder
            .whereRaw('LOWER(title) LIKE ?', [`%${search.toLowerCase()}%`])
            .orWhereRaw('LOWER(summary) LIKE ?', [`%${search.toLowerCase()}%`])
        })
      }

      if (departments.length > 0) {
        query.whereIn('department', departments)
      }

      if (employmentTypes.length > 0) {
        query.whereIn('employmentType', employmentTypes)
      }

      const jobs = await query.paginate(page, perPage)

      const formattedOffers = JobPostingTransformer.paginate(jobs.all(), jobs.getMeta()).useVariant(
        'publicSummaryDetails'
      )

      return inertia.render('jobs/all', {
        offers: page === 1 ? formattedOffers : inertia.merge(formattedOffers),
        filters: {
          search,
          departments,
          employmentTypes,
        },
      })
    } catch {
      return inertia.render('jobs/all', {
        queryError: true,
        offers: {
          data: [],
          metadata: {
            total: 0,
            perPage: 0,
            currentPage: 0,
            lastPage: 0,
            firstPage: 0,
          },
        },
        filters: {
          search,
          departments,
          employmentTypes,
        },
      })
    }
  }

  async single({ params, inertia }: HttpContext) {
    const { slug } = params

    const job = await JobPosting.findByOrFail('slug', slug)

    await job.checkAndDeactivate()

    if (!job.isActive && job.postedAt && job.postedAt > DateTime.now()) {
      throw new Exception('Not found', { status: 404 })
    }

    return inertia.render('jobs/single', {
      offer: JobPostingTransformer.transform(job).useVariant('allFields'),
    })
  }
}
