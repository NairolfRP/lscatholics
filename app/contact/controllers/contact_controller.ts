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

  async submit({ logger, request, inertia }: HttpContext) {
    const data = request.all()
    const payload = await createContactValidator.validate(data)

    try {
      const webhookUrl = env.get('DISCORD_CONTACT_WEBHOOK')
      if (!webhookUrl) {
        logger.error('[CONTACT] Discord webhook URL not configured')
        return this.service.renderErrorResponse(inertia, {
          success: false,
          message: this.service.ERROR_MESSAGES.MISSING_WEBHOOK,
          errorCode: 'MISSING_WEBHOOK_URL',
        })
      }

      const { success } = await this.service.sendToDiscord(payload, webhookUrl)

      if (!success) {
        return this.service.renderErrorResponse(inertia, {
          success: false,
          message: this.service.ERROR_MESSAGES.WEBHOOK_FAILED,
          errorCode: 'WEBHOOK_EXECUTION_FAILED',
        })
      }

      return this.service.renderSuccessResponse(inertia, {
        success: true,
        message: this.service.ERROR_MESSAGES.SUCCESS,
      })
    } catch (e) {
      logger.error('Unexpected error in contact submission', { error: e.message })
      return this.service.renderErrorResponse(inertia, {
        success: false,
        message: this.service.ERROR_MESSAGES.WEBHOOK_FAILED,
        errorCode: 'UNEXPECTED_ERROR',
      })
    }
  }
}
