import { inject } from '@adonisjs/core'
import { DateTime } from 'luxon'
import logger from '@adonisjs/core/services/logger'
import fleecaConfig from '#config/fleeca'
import type {
  FleecaWebhookPayload,
  InitiatePaymentOptions,
  InitiatePaymentResult,
  ResolvedPaymentStatus,
} from '#billing/types/payment'
import { FleecaClient } from '#billing/services/fleeca_client'
import PendingPayment from '#billing/models/pending_payment'
import PaymentException from '#billing/exceptions/payment_exception'
import { PaymentHandlerRegistry } from '#billing/handlers/payment_handler_registry'

/**
 * How long a pending payment lives before being considered stale.
 * Should comfortably exceed the Fleeca session timeout on the hosted page.
 */
const PENDING_TTL_MINUTES = 30

@inject()
export class PaymentService {
  constructor(
    private readonly fleeca: FleecaClient,
    private readonly handlers: PaymentHandlerRegistry
  ) {}

  /**
   * Create a payment link and persist a transient pending record.
   * Called by feature controllers — never from the webhook handler.
   */
  async initiatePayment(options: InitiatePaymentOptions): Promise<InitiatePaymentResult> {
    const { source, amount, metadata = {}, description } = options

    if (!amount || amount <= 0) {
      throw PaymentException.create('INVALID_PRICE')
    }
    if (!source?.trim()) {
      throw PaymentException.custom('Payment source is required', 'INVALID_PARAMETERS')
    }
    if (!this.handlers.has(source)) {
      throw PaymentException.custom(
        `No handler registered for payment source "${source}"`,
        'INVALID_PARAMETERS'
      )
    }

    const response = await this.fleeca.createPayment({
      amount,
      mode: fleecaConfig.mode,
      description,
    })

    await PendingPayment.create({
      id: response.payment_id,
      source,
      amount,
      mode: fleecaConfig.mode,
      metadata,
      expiresAt: DateTime.now().plus({ minutes: PENDING_TTL_MINUTES }),
    })

    logger.info({ paymentId: response.payment_id, source, amount }, 'Pending payment created')

    return {
      paymentId: response.payment_id,
      paymentUrl: response.payment_link,
    }
  }

  /**
   * Validate and dispatch a signed Fleeca webhook.
   *
   * On a terminal status the pending record is **deleted** — it has served its
   * purpose as a correlation key between initiation and webhook.
   */
  async processWebhook(rawBody: string, signature: string): Promise<void> {
    if (!this.fleeca.verifyWebhookSignature(rawBody, signature)) {
      throw PaymentException.create('WEBHOOK_SIGNATURE_INVALID')
    }

    let payload: FleecaWebhookPayload
    try {
      payload = JSON.parse(rawBody)
    } catch (err) {
      throw PaymentException.create('VALIDATION_ERROR', err)
    }

    const pending = await PendingPayment.find(payload.payment_id)

    if (!pending) {
      logger.warn(
        { paymentId: payload.payment_id, status: payload.status },
        'Payment Webhook received for unknown or already-processed payment — ignored'
      )
      return
    }

    const expectedMode = fleecaConfig.mode === 1 ? 'live' : 'sandbox'

    if (payload.amount !== pending.amount) {
      logger.error(
        { paymentId: pending.id, expected: pending.amount, received: payload.amount },
        'Payment Webhook amount mismatch — payment rejected'
      )
      await pending.delete()
      throw PaymentException.custom(
        `Amount mismatch: expected ${pending.amount}, received ${payload.amount}`,
        'WEBHOOK_AMOUNT_MISMATCH'
      )
    }

    if (payload.mode !== expectedMode) {
      logger.error(
        { paymentId: pending.id, expected: expectedMode, received: payload.mode },
        'Payment Webhook mode mismatch — payment rejected'
      )
      await pending.delete()
      throw PaymentException.custom(
        `Mode mismatch: expected ${expectedMode}, received ${payload.mode}`,
        'WEBHOOK_MODE_MISMATCH'
      )
    }

    if (pending.expiresAt < DateTime.now()) {
      logger.warn(
        { paymentId: pending.id },
        'Payment Webhook arrived for an expired pending payment'
      )
      await pending.delete()
      return
    }

    if (payload.status === 'pending') {
      logger.debug(
        { paymentId: payload.payment_id },
        'Intermediate pending payment webhook received'
      )
      return
    }

    const handler = this.handlers.resolve(pending.source)

    if (payload.status === 'payment_successful') {
      await handler.onSuccess(pending)
    } else if (payload.status === 'payment_failed') {
      await handler.onFailure?.(pending)
    }

    await pending.delete()

    logger.info(
      { paymentId: pending.id, status: payload.status, source: pending.source },
      'Pending payment resolved and removed'
    )
  }

  /**
   * Resolve the current status of a payment.
   *
   * Strategy:
   *   1. Look in `pending_payments` — if found, status is still pending.
   *   2. If not found, query the Fleeca API as fallback — the webhook already
   *      deleted the record, so Fleeca is the only source of truth.
   *   3. If Fleeca also returns 404, the payment_id is genuinely unknown.
   */
  async resolvePaymentStatus(paymentId: string): Promise<ResolvedPaymentStatus> {
    const pending = await PendingPayment.find(paymentId)

    if (pending) {
      if (pending.expiresAt < DateTime.now()) {
        await pending.delete()
        logger.info({ paymentId }, 'Expired pending payment reaped on read')
        return { origin: 'expired' }
      }

      return {
        origin: 'pending_table',
        status: 'pending',
        amount: pending.amount,
        source: pending.source,
      }
    }

    try {
      const details = await this.fleeca.getPayment(paymentId)
      return {
        origin: 'fleeca_api',
        status: details.status,
        amount: details.amount,
      }
    } catch (err) {
      if (err instanceof PaymentException && err.code === 'HTTP_CLIENT_ERROR') {
        return { origin: 'not_found' }
      }
      throw err
    }
  }

  /**
   * Delete all pending records past their expires_at.
   * Call from a scheduler to keep the table lean.
   *
   * @returns number of rows deleted
   */
  async purgeExpiredPending(): Promise<number> {
    const count = await PendingPayment.query()
      .where('expires_at', '<', DateTime.now().toSQL()!)
      .delete()

    if (count.length > 0) {
      logger.info({ count: count.length }, 'Expired pending payments purged')
    }

    return count.length
  }
}
