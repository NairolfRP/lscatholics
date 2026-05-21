import type { HttpContext } from '@adonisjs/core/http'
import { createVolunteerApplicationValidator } from '#volunteers/validators/volunteer_application'
// oxlint-disable-next-line typescript/consistent-type-imports
import { VolunteerApplicationService } from '#volunteers/services/volunteer_application_service'
import { inject } from '@adonisjs/core'

@inject()
export default class VolunteersController {
  constructor(protected applicationService: VolunteerApplicationService) {}

  index({ inertia }: HttpContext) {
    return inertia.render('volunteers', {})
  }

  async submit({ request, logger, session, response }: HttpContext) {
    const payload = await request.validateUsing(createVolunteerApplicationValidator)

    try {
      await this.applicationService.sendToDiscord(payload)

      session.flash(
        'success',
        'Votre candidature pour le bénévolat a été soumise avec succès. Nous vous recontacterons dans les plus brefs délais.'
      )

      return response.redirect().back()
    } catch (err) {
      logger.error({ err }, 'Failed to send volunteer application to Discord')
      session.flash(
        'error',
        'Un problème est survenu. Réessayez ou contactez un administrateur du site si cela se répète.'
      )
      response.redirect().back()
    }
  }
}
