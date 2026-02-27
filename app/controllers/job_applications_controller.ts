import type { HttpContext } from '@adonisjs/core/http'
import Job from '#models/job'
import { Exception } from '@adonisjs/core/exceptions'
import { DateTime } from 'luxon'
import { createEmploymentApplicationValidator } from '#validators/employment_application'
import JobTransformer from '#transformers/job_transformer'
import { inject } from '@adonisjs/core'
import { JobApplicationService } from '#services/job_application_service'

@inject()
export default class JobApplicationsController {
  constructor(protected applicationService: JobApplicationService) {}

  private async fetchJob(slug: string) {
    const job = await Job.query()
      .select('id', 'slug', 'title')
      .where('slug', slug)
      .andWhere('is_active', true)
      .andWhere('expires_at', '>', DateTime.now().toSQL())
      .first()
    if (!job) throw new Exception('Job offer not found or expired', { status: 404 })
    return job
  }

  async index({ params, inertia }: HttpContext) {
    const slug = params.slug as string

    const job = await this.fetchJob(slug)

    const isExpired = !!(job.expiresAt && job.expiresAt >= DateTime.now())

    return inertia.render('jobs/application', {
      job: JobTransformer.transform(job).useVariant('employmentApplication'),
      isExpired,
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
      session.flashErrors({
        E_EMPLOYMENT_APPLICATION:
          'Une erreur est survenue lors de la soumission de votre candidature. Veuillez réessayer plus tard.',
      })
      response.redirect().back()
    }
  }
}
