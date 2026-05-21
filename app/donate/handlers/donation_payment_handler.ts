import { inject } from '@adonisjs/core'
import type { PaymentHandler } from '#billing/types/payment_handler'
import type PendingPayment from '#billing/models/pending_payment'
// oxlint-disable-next-line typescript/consistent-type-imports
import { DonateService } from '#donate/services/donate_service'
import type { DonateMetadata } from '#donate/types/donate'
import logger from '@adonisjs/core/services/logger'

type DonationMetadata = Omit<DonateMetadata, 'fleecaConfirmation'>

@inject()
export class DonationPaymentHandler implements PaymentHandler {
  readonly source = 'donation'

  constructor(private readonly donateService: DonateService) {}

  async onSuccess(payment: PendingPayment): Promise<void> {
    const metadata = payment.metadata as DonationMetadata

    const notificationData = { ...metadata, amount: payment.amount }

    await Promise.all([
      this.donateService.sendPrivateDonateNotification(notificationData),
      this.donateService.sendPublicDonateNotification(notificationData),
    ])

    logger.info({ paymentId: payment.id, amount: payment.amount }, 'Donation notifications sent')
  }

  async onFailure(payment: PendingPayment): Promise<void> {
    logger.warn({ paymentId: payment.id, amount: payment.amount }, 'Donation payment failed')
  }
}
