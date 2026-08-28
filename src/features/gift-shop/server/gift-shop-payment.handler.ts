import { GIFT_ORDER_SOURCE } from '#/features/gift-shop/constants/gift-shop.constants.ts'
import type { GiftOrderMetadata } from '#/features/gift-shop/types/gift-shop.types.ts'
import { logger } from '#server/integrations/logger.ts'
import { decryptMetadata } from '#server/payments/payment-crypto.service.ts'
import type { PaymentHandler } from '#server/payments/payment-handler.ts'
import { paymentHandlerRegistry } from '#server/payments/payment-handler.ts'
import type { PendingPayment } from '#server/repositories/pending-payment.repository.ts'
import { sendGiftShopNotification } from './gift-shop-notification.service'

class GiftShopPaymentHandler implements PaymentHandler {
  readonly source = GIFT_ORDER_SOURCE

  async onSuccess(payment: PendingPayment): Promise<void> {
    const metadata = decryptMetadata<GiftOrderMetadata>(payment.metadata)
    await sendGiftShopNotification({ ...metadata, amount: payment.amount })
    logger.info(
      { paymentId: payment.id, amount: payment.amount },
      'Gift shop order payment successful, notification sent'
    )
  }

  onFailure(payment: PendingPayment): Promise<void> {
    logger.warn({ paymentId: payment.id, amount: payment.amount }, 'Gift shop order payment failed')
    return Promise.resolve()
  }
}

export const giftShopPaymentHandler = new GiftShopPaymentHandler()

paymentHandlerRegistry.register(giftShopPaymentHandler)
