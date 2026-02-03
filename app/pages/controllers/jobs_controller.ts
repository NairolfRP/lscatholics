import type { HttpContext } from '@adonisjs/core/http'
import Job from '#pages/models/job'
import { DateTime } from 'luxon'

type JobOffer = {
  id: number
  slug: string
  title: string
  department: string
  postedAt: string
}

export default class JobsController {
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
      const total = await Job.query().count('* as count').where('is_active', true)
      const lastPage = Math.max(1, Math.ceil(Number(total[0].$extras.count) / perPage))

      if (page > lastPage) page = 1

      const query = Job.query()
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

      const formattedOffers = jobs.toJSON().data as JobOffer[]

      const meta = jobs.getMeta() as {
        total: number
        perPage: number
        currentPage: number
        lastPage: number
        firstPage: number
        firstPageUrl: string | null
        lastPageUrl: string | null
        nextPageUrl: string | null
        previousPageUrl: string | null
      }
      return inertia.render('jobs/all', {
        offers:
          page === 1
            ? formattedOffers
            : (inertia.merge(() => formattedOffers) as unknown as JobOffer[]),
        offersMeta: meta,
        filters: {
          search,
          departments,
          employmentTypes,
        },
      })
    } catch {
      return inertia.render('jobs/all', {
        queryError: true,
        offers: [],
        offersMeta: {
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
        filters: {
          search,
          departments,
          employmentTypes,
        },
      })
    }
  }

  async single({ params, response, inertia }: HttpContext) {
    const { slug } = params

    const job = await Job.findByOrFail('slug', slug)

    await job.checkAndDeactivate()

    if (!job.isActive && job.postedAt && job.postedAt > DateTime.now()) {
      response.status(404)
      return inertia.render('errors/not_found')
    }

    return inertia.render('jobs/single', {
      offer: job.toJSON(),
    })
  }
}
