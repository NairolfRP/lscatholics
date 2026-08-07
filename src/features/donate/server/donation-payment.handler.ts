import { DONATION_SOURCE } from '#/features/donate/constants/donate.constants.ts'
import type { DonationMetadata } from '#/features/donate/types/donate.types.ts'
import { logger } from '#server/integrations/logger.ts'
import { decryptMetadata } from '#server/payments/payment-crypto.service.ts'
import type { PaymentHandler } from '#server/payments/payment-handler.ts'
import { paymentHandlerRegistry } from '#server/payments/payment-handler.ts'
import type { PendingPayment } from '#server/repositories/pending-payment.repository.ts'
import {
  sendPrivateDonationNotification,
  sendPublicDonationNotification,
} from './donation-notification.service'

class DonationPaymentHandler implements PaymentHandler {
  readonly source = DONATION_SOURCE

  async onSuccess(payment: PendingPayment): Promise<void> {
    const metadata = decryptMetadata<DonationMetadata>(payment.metadata)
    await Promise.all([
      sendPrivateDonationNotification({ ...metadata, amount: payment.amount }),
      sendPublicDonationNotification({ ...metadata, amount: payment.amount }),
    ])
    logger.info(
      { paymentId: payment.id, amount: payment.amount },
      'Donation payment successful, notifications sent'
    )
  }

  onFailure(payment: PendingPayment): Promise<void> {
    logger.warn({ paymentId: payment.id, amount: payment.amount }, 'Donation payment failed')
    return Promise.resolve()
  }
}

export const donationPaymentHandler = new DonationPaymentHandler()

paymentHandlerRegistry.register(donationPaymentHandler)
