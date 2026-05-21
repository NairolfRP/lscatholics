import type { HttpContext } from '@adonisjs/core/http'
import { createDonateFormValidator } from '#donate/validators/donate'
import { inject } from '@adonisjs/core'
// oxlint-disable-next-line typescript/consistent-type-imports
import { PaymentService } from '#billing/services/payment_service'

@inject()
export default class DonateController {
  private pageName = 'donate' as const

  constructor(private readonly paymentService: PaymentService) {}

  index({ inertia }: HttpContext) {
    return inertia.render(this.pageName, {})
  }

  async submit({ request, response, session, logger, inertia }: HttpContext) {
    const payload = await request.validateUsing(createDonateFormValidator)

    const { fleecaConfirmation: _fleecaConfirmation, ...metadata } = payload

    try {
      const donatorName = payload.isOrganization
        ? payload.organizationName
        : `${payload.firstname} ${payload.lastname}`
      const { paymentUrl } = await this.paymentService.initiatePayment({
        source: 'donation',
        amount: payload.amount,
        metadata,
        description: `Don — ${donatorName}`,
      })

      return inertia.render(this.pageName, { paymentUrl })
    } catch (error) {
      logger.error({ err: error }, 'Failed to initiate donation payment')
      session.flash('error', 'Erreur lors de la création du paiement. Veuillez réessayer.')
      return response.redirect().back()
    }
  }
}
