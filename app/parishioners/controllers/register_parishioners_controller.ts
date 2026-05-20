import type { HttpContext } from '@adonisjs/core/http'
import { createRegisterParishionerValidator } from '#parishioners/validators/register_parishioner'
import env from '#start/env'
import { RegisterParishionerService } from '#parishioners/services/register_parishioner_service'
import { inject } from '@adonisjs/core'

@inject()
export default class RegisterParishionersController {
  constructor(protected service: RegisterParishionerService) {}

  index({ inertia }: HttpContext) {
    return inertia.render('register-parishioner', {})
  }

  async submit({ request, logger, response, session }: HttpContext) {
    const payload = await request.validateUsing(createRegisterParishionerValidator)

    try {
      const webhookUrl = env.get('DISCORD_PARISHIONER_REGISTRATION')

      const result = await this.service.register(webhookUrl, payload)

      if (!result.success) {
        logger.error({ error: result.error }, 'Failed to register parishioner')
        session.flash('error', "L'enregistrement a échoué. Réessayez plus tard.")

        return response.redirect().back()
      }

      session.flash(
        'success',
        'Félicitations. Votre foyer a été enregistré comme paroissien avec succès.'
      )

      return response.redirect().back()
    } catch (error) {
      logger.error({ err: error }, 'Error registering parishioner')
      session.flash(
        'error',
        "Un problème est survenu lors de l'enregistrement. Contactez un administrateur du site."
      )
      return response.redirect().back()
    }
  }
}
