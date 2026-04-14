import type { HttpContext } from '@adonisjs/core/http'
import { createContactValidator } from '#pages/validators/contact_validation'
import env from '#start/env'
import { inject } from '@adonisjs/core'
import { ContactService } from '#pages/services/contact_service'
import { CONTACT_SUBJECTS } from '#shared/constants/contact_subjects'

@inject()
export default class ContactController {
  constructor(protected service: ContactService) {}

  index({ inertia }: HttpContext) {
    return inertia.render('contact', {
      subjects: CONTACT_SUBJECTS,
    })
  }

  async submit({ logger, request, response, session }: HttpContext) {
    const payload = await request.validateUsing(createContactValidator)

    try {
      const webhookUrl = env.get('DISCORD_CONTACT_WEBHOOK')
      if (!webhookUrl) {
        logger.error(undefined, '[CONTACT] Discord webhook URL not configured')
        session.flash('error', this.service.ERROR_MESSAGES.MISSING_WEBHOOK)

        return response.redirect().back()
      }

      const { success } = await this.service.sendToDiscord(payload, webhookUrl)

      if (!success) {
        session.flash('error', this.service.ERROR_MESSAGES.WEBHOOK_FAILED)

        return response.redirect().back()
      }

      session.flash('success', this.service.ERROR_MESSAGES.SUCCESS)

      return response.redirect().back()
    } catch (e) {
      logger.error({ err: e }, 'Unexpected error in contact submission')
      session.flash('error', this.service.ERROR_MESSAGES.WEBHOOK_FAILED)

      return response.redirect().back()
    }
  }
}
