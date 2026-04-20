import type PendingPayment from '#billing/models/pending_payment'

/**
 * @example
 * // app/donate/handlers/donation_payment_handler.ts
 * export class DonationPaymentHandler implements PaymentHandler {
 *   readonly source = 'donation'
 *   async onSuccess(payment: PendingPayment) { ... }
 * }
 */
export interface PaymentHandler {
  /** Must match the `source` string used when calling `PaymentService.initiatePayment()` */
  readonly source: string

  /** Called when Fleeca reports `payment_successful` */
  onSuccess(payment: PendingPayment): Promise<void>

  /** Called when Fleeca reports `payment_failed` — optional, defaults to no-op */
  onFailure?(payment: PendingPayment): Promise<void>
}
