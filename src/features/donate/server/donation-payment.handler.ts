import { DONATION_SOURCE } from '#/features/donate/constants/donate.constants.ts'
import type { DonationMetadata } from '#/features/donate/types/donate.types.ts'
import { logger } from '#server/integrations/logger.ts'
import { decryptMetadata } from '#server/payments/payment-crypto.service.ts'
import type { PaymentHandler } from '#server/payments/payment-handler.ts'
import { paymentHandlerRegistry } from '#server/payments/payment-handler.ts'
import type { PendingPayment } from '#server/repositories/pending-payment.repository.ts'
import { sendDonationConfirmationMail } from './donation-mail.service'
import {
  sendPrivateDonationNotification,
  sendPublicDonationNotification,
} from './donation-notification.service'

class DonationPaymentHandler implements PaymentHandler {
  readonly source = DONATION_SOURCE

  async onSuccess(payment: PendingPayment): Promise<void> {
    const metadata = decryptMetadata<DonationMetadata>(payment.metadata)
    const data = { ...metadata, amount: payment.amount }
    await Promise.all([
      sendPrivateDonationNotification(data),
      sendPublicDonationNotification(data),
      sendDonationConfirmationMail(data),
    ])
    logger.info(
      { source: payment.source, paymentId: payment.id, amount: payment.amount },
      'Donation payment successful, notifications sent'
    )
  }

  onFailure(payment: PendingPayment): Promise<void> {
    logger.warn(
      { source: payment.source, paymentId: payment.id, amount: payment.amount },
      'Donation payment failed'
    )
    return Promise.resolve()
  }
}

export const donationPaymentHandler = new DonationPaymentHandler()

paymentHandlerRegistry.register(donationPaymentHandler)
