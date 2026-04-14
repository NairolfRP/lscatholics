import type { HttpContext } from '@adonisjs/core/http'
import JobPosting from '#careers/models/job_posting'
import { Exception } from '@adonisjs/core/exceptions'
import { DateTime } from 'luxon'
import { createEmploymentApplicationValidator } from '#careers/validators/employment_application'
import JobPostingTransformer from '#careers/transformers/job_posting_transformer'
import { inject } from '@adonisjs/core'
import { JobApplicationService } from '#careers/services/job_application_service'

@inject()
export default class JobApplicationsController {
  constructor(protected applicationService: JobApplicationService) {}

  private async fetchJob(slug: string) {
    const job = await JobPosting.query()
      .select('id', 'slug', 'title')
      .where('slug', slug)
      .andWhere('is_active', true)
      .andWhere((query) => {
        query.where('expires_at', '>', DateTime.now().toSQL()).orWhereNull('expires_at')
      })
      .first()
    if (!job) throw new Exception('Job offer not found or expired', { status: 404 })
    return job
  }

  async index({ params, inertia }: HttpContext) {
    const slug = params.slug as string

    const job = await this.fetchJob(slug)

    //const isExpired = !!(job.expiresAt && job.expiresAt < DateTime.now())

    return inertia.render('jobs/application', {
      job: JobPostingTransformer.transform(job).useVariant('employmentApplication'),
    })
  }

  async submit({ params, logger, request, response, session, auth }: HttpContext) {
    const slug = params.slug as string

    const job = await this.fetchJob(slug)
    const payload = await request.validateUsing(createEmploymentApplicationValidator)

    const characterFullName = `${payload.firstname}${payload.middleName ? ' ' + payload.middleName + ' ' : ' '}${payload.lastname}`

    try {
      await this.applicationService.sendToDiscord(job, payload)

      return response.redirect().toRoute('jobs.single', { slug: job.slug })
    } catch (err) {
      logger.error(
        { err, userId: auth.user?.id, characterName: characterFullName },
        'Failed to process job application'
      )
      session.flash(
        'error',
        'Une erreur est survenue lors de la soumission de votre candidature. Veuillez réessayer plus tard.'
      )
      response.redirect().back()
    }
  }
}
