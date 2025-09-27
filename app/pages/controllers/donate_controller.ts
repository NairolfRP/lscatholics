import type { HttpContext } from '@adonisjs/core/http'
import { createDonateFormValidator } from '#pages/validators/donate'
import { inject } from '@adonisjs/core'
import { PaymentService } from '#core/services/payment_service'

@inject()
export default class DonateController {
  private pageName = 'donate'

  constructor(private paymentService: PaymentService) {}

  index({ inertia }: HttpContext) {
    return inertia.render(this.pageName)
  }

  async submit({ request, response, session, logger, inertia }: HttpContext) {
    const payload = await request.validateUsing(createDonateFormValidator)

    const { fleecaConfirmation, ...metadata } = payload

    try {
      const paymentSession = await this.paymentService.generatePaymentUrl(
        'donation',
        payload.amount,
        metadata,
        session
      )

      return inertia.render(this.pageName, {
        paymentUrl: paymentSession.paymentUrl,
      })
    } catch (error) {
      logger.error({ err: error }, 'Error creating a donation')
      session.flashErrors({ E_DONATE_ERROR: 'Erreur lors de la création du paiement' })
      return response.redirect().back()
    }
  }
}
