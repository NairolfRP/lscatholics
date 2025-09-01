import type { HttpContext } from '@adonisjs/core/http'
import { createContactValidator } from '#contact/validators/contact_validation'
import env from '#start/env'
import { inject } from '@adonisjs/core'
import { ContactService } from '#contact/services/contact_service'

@inject()
export default class ContactController {
  constructor(protected service: ContactService) {}

  index({ inertia }: HttpContext) {
    return inertia.render('contact')
  }

  async submit({ logger, request, response, session }: HttpContext) {
    const payload = await request.validateUsing(createContactValidator)

    try {
      const webhookUrl = env.get('DISCORD_CONTACT_WEBHOOK')
      if (!webhookUrl) {
        logger.error('[CONTACT] Discord webhook URL not configured')
        session.flashErrors({
          CONTACT_ERROR: this.service.ERROR_MESSAGES.MISSING_WEBHOOK,
        })

        return response.redirect().back()
      }

      const { success } = await this.service.sendToDiscord(payload, webhookUrl)

      if (!success) {
        session.flashErrors({
          CONTACT_ERROR: this.service.ERROR_MESSAGES.WEBHOOK_FAILED,
        })

        return response.redirect().back()
      }

      session.flash('success', this.service.ERROR_MESSAGES.SUCCESS)

      return response.redirect().back()
    } catch (e) {
      logger.error('Unexpected error in contact submission', { error: e.message })
      session.flashErrors({
        CONTACT_ERROR: this.service.ERROR_MESSAGES.WEBHOOK_FAILED,
      })

      return response.redirect().back()
    }
  }
}
