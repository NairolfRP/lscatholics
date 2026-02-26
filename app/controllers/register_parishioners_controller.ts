import type { HttpContext } from '@adonisjs/core/http'
import { createRegisterParishionerValidator } from '#validators/register_parishioner'
import env from '#start/env'
import { RegisterParishionerService } from '#services/register_parishioner_service'

export default class RegisterParishionersController {
  index({ inertia }: HttpContext) {
    return inertia.render('register-parishioner', {})
  }

  async submit({ request, logger, response, session }: HttpContext) {
    const payload = await request.validateUsing(createRegisterParishionerValidator)

    try {
      const webhookUrl = env.get('DISCORD_PARISHIONER_REGISTRATION')

      const result = await RegisterParishionerService.register(webhookUrl, payload)

      if (!result.success) {
        logger.error({ error: result.error }, 'Failed to register parishioner')
        session.flashErrors({
          E_REGISTER_PARISHIONER_ERROR: "L'enregistrement a échoué. Réessayez plus tard.",
        })

        return response.redirect().back()
      }

      session.flash(
        'success',
        'Félicitations. Votre foyer a été enregistré comme paroissien avec succès.'
      )

      return response.redirect().back()
    } catch (error) {
      logger.error({ err: error }, 'Error registering parishioner')
      session.flashErrors({
        E_REGISTER_PARISHIONER_ERROR:
          "Un problème est survenu lors de l'enregistrement. Contactez un administrateur du site.",
      })
      return response.redirect().back()
    }
  }
}
