import { logger } from '#server/integrations/logger.ts'
import { notFoundCache } from '#server/payments/not-found-cache.ts'
import { encryptMetadata } from '#server/payments/payment-crypto.service.ts'
import type { PendingPayment } from '#server/repositories/pending-payment.repository.ts'
import { pendingPaymentRepository } from '#server/repositories/pending-payment.repository.ts'
import { inProd } from '#server/services/app.service.ts'
import type { FleecaWebhookPayload } from '#server/services/fleeca.service.ts'
import {
  FLEECA_PAYMENT_MODE,
  fleecaClient,
  FleecaClientError,
} from '#server/services/fleeca.service.ts'
import { paymentHandlerRegistry } from './payment-handler.ts'

/** How long a created payment stays valid before being considered expired. */
export const PENDING_PAYMENT_TTL_MINUTES = 30

/** Beyond this age an expired payment still stuck at "pending" is reaped. */
export const MAX_RECONCILIATION_AGE_MS = 7 * 24 * 60 * 60 * 1_000

const MAX_WEBHOOK_BODY_BYTES = 16_384

const VALID_WEBHOOK_STATUSES: ReadonlySet<string> = new Set([
  'payment_successful',
  'payment_failed',
  'pending',
])

function isPaymentNotFound(err: unknown): err is FleecaClientError {
  return (
    err instanceof FleecaClientError &&
    (err.code === 'INVALID_PAYMENT_ID' || (err.code === 'HTTP' && err.status === 404))
  )
}

export interface InitiatePaymentOptions {
  source: string
  amount: number
  metadata: unknown
  description?: string
}

export interface InitiatePaymentResult {
  paymentId: string
  paymentUrl: string
}

export interface WebhookProcessingResult {
  status: number
  body: string
}

export type ResolvedPaymentStatus =
  | { origin: 'pending'; amount: number }
  | { origin: 'fleeca_api'; status: FleecaWebhookPayload['status']; amount: number }
  | { origin: 'expired' }
  | { origin: 'not_found' }

type ReconcileOutcome =
  | { kind: 'terminal'; result: ResolvedPaymentStatus }
  | { kind: 'pending' }
  | { kind: 'not_found' }
  | { kind: 'error'; err: unknown }

interface ReconcileExpiredResult {
  status: ResolvedPaymentStatus
  deleted: boolean
  reconciled: boolean
}

function isValidWebhookPayload(payload: unknown): payload is FleecaWebhookPayload {
  if (typeof payload !== 'object' || payload === null) return false
  const { payment_id, status, amount } = payload as Record<string, unknown>
  return (
    typeof payment_id === 'string' &&
    payment_id.length > 0 &&
    typeof status === 'string' &&
    VALID_WEBHOOK_STATUSES.has(status) &&
    typeof amount === 'number' &&
    Number.isFinite(amount)
  )
}

export class PaymentService {
  async initiatePayment(options: InitiatePaymentOptions): Promise<InitiatePaymentResult> {
    const { source, amount, metadata, description } = options

    if (!paymentHandlerRegistry.has(source)) {
      throw new Error(`No payment handler registered for source "${source}"`)
    }

    const mode = inProd ? FLEECA_PAYMENT_MODE.LIVE : FLEECA_PAYMENT_MODE.SANDBOX

    if (inProd && mode === FLEECA_PAYMENT_MODE.SANDBOX) {
      logger.error('Refusing to create a sandbox payment in production')
      throw new Error('Refusing to create a sandbox payment in production')
    }

    const payment = await fleecaClient.createPayment({ amount, mode, description })

    await pendingPaymentRepository.create({
      id: payment.payment_id,
      source,
      amount,
      mode,
      metadata: encryptMetadata(metadata),
      expiresAt: new Date(Date.now() + PENDING_PAYMENT_TTL_MINUTES * 60_000),
    })

    return { paymentId: payment.payment_id, paymentUrl: payment.payment_link }
  }

  async resolvePaymentStatus(paymentId: string): Promise<ResolvedPaymentStatus> {
    const pending = await pendingPaymentRepository.findById(paymentId)

    if (pending) {
      if (inProd && pending.mode === FLEECA_PAYMENT_MODE.SANDBOX) {
        logger.error(
          { paymentId: pending.id },
          'Sandbox payment found in production — refusing to resolve it'
        )
        return { origin: 'expired' }
      }

      if (pending.expiresAt < new Date()) {
        const { status } = await this.#reconcileExpired(pending)
        return status
      }

      return { origin: 'pending', amount: pending.amount }
    }

    if (notFoundCache.has(paymentId)) {
      return { origin: 'not_found' }
    }

    try {
      const details = await fleecaClient.getPayment(paymentId)
      return { origin: 'fleeca_api', status: details.status, amount: details.amount }
    } catch (err) {
      if (isPaymentNotFound(err)) {
        if (err.code === 'HTTP') {
          notFoundCache.set(paymentId)
        }
        return { origin: 'not_found' }
      }
      throw err
    }
  }

  /**
   * A webhook may have been missed for an expired pending payment (e.g. a
   * transient delivery failure). Ask Fleeca for the real status before
   * reaping: if the payment actually completed, process it like a webhook.
   * A still-pending payment is kept so a later reconciliation can resolve it,
   * unless it exceeds {@link MAX_RECONCILIATION_AGE_MS}.
   *
   * Sandbox payments are never reconciled: no webhook reaches `localhost` and
   * Fleeca auto-approves sandbox payments on creation, so `getPayment` is not
   * a reliable signal there. The webhook is the only confirmation — without it
   * an expired sandbox payment is reaped as-is.
   */
  async #reconcileExpired(pending: PendingPayment): Promise<ReconcileExpiredResult> {
    if (pending.mode === FLEECA_PAYMENT_MODE.SANDBOX) {
      await pendingPaymentRepository.deleteById(pending.id)
      logger.info(
        { paymentId: pending.id },
        'Expired sandbox payment reaped without reconciliation'
      )
      return { status: { origin: 'expired' }, deleted: true, reconciled: false }
    }

    if (Date.now() - pending.createdAt.getTime() > MAX_RECONCILIATION_AGE_MS) {
      await pendingPaymentRepository.deleteById(pending.id)
      logger.warn({ paymentId: pending.id }, 'Expired payment beyond reconciliation age — reaped')
      return { status: { origin: 'expired' }, deleted: true, reconciled: false }
    }

    const outcome = await this.#reconcileWithFleeca(pending)
    switch (outcome.kind) {
      case 'terminal':
        return { status: outcome.result, deleted: true, reconciled: true }
      case 'pending':
        logger.info(
          { paymentId: pending.id },
          'Expired payment still pending at Fleeca — keeping for a later reconciliation'
        )
        return {
          status: { origin: 'pending', amount: pending.amount },
          deleted: false,
          reconciled: false,
        }
      case 'not_found':
        await pendingPaymentRepository.deleteById(pending.id)
        logger.info({ paymentId: pending.id }, 'Expired pending payment reaped on read')
        return { status: { origin: 'expired' }, deleted: true, reconciled: false }
      case 'error':
        logger.error(
          { err: outcome.err, paymentId: pending.id },
          'Failed to reconcile expired payment with Fleeca — keeping it for a later attempt'
        )
        return { status: { origin: 'expired' }, deleted: false, reconciled: false }
    }
  }

  /** Ask Fleeca for a pending payment's real status and process it if terminal. */
  async #reconcileWithFleeca(pending: PendingPayment): Promise<ReconcileOutcome> {
    try {
      const details = await fleecaClient.getPayment(pending.id)
      if (details.status === 'payment_successful' || details.status === 'payment_failed') {
        if (details.amount !== pending.amount) {
          logger.error(
            {
              paymentId: pending.id,
              expectedAmount: pending.amount,
              receivedAmount: details.amount,
            },
            'Reconciled payment amount mismatch — payment kept pending, not processed'
          )
          return { kind: 'error', err: new Error('Reconciled payment amount mismatch') }
        }

        const claimed = await pendingPaymentRepository.claimAndDeleteById(pending.id)
        if (claimed) {
          await this.#runPaymentHandler(claimed, details.status)
        }
        return {
          kind: 'terminal',
          result: { origin: 'fleeca_api', status: details.status, amount: details.amount },
        }
      }

      return { kind: 'pending' }
    } catch (err) {
      if (isPaymentNotFound(err)) {
        return { kind: 'not_found' }
      }
      return { kind: 'error', err }
    }
  }

  /** Reconcile expired pending payments against Fleeca. Used by the cleanup task. */
  async reconcileExpiredPayments(
    now = new Date()
  ): Promise<{ reconciled: number; deleted: number }> {
    const expired = await pendingPaymentRepository.findExpired(now)
    let reconciled = 0
    let deleted = 0

    for (const pending of expired) {
      const { reconciled: isReconciled, deleted: isDeleted } = await this.#reconcileExpired(pending)
      if (isReconciled) {
        reconciled += 1
      } else if (isDeleted) {
        deleted += 1
      }
    }

    return { reconciled, deleted }
  }

  async processWebhook(input: {
    rawBody: string
    signature: string
  }): Promise<WebhookProcessingResult> {
    const { rawBody, signature } = input

    if (Buffer.byteLength(rawBody, 'utf8') > MAX_WEBHOOK_BODY_BYTES) {
      logger.error({ bytes: Buffer.byteLength(rawBody, 'utf8') }, 'Fleeca webhook body too large')
      return { status: 413, body: 'Payload Too Large' }
    }

    if (!signature) {
      logger.warn('Fleeca webhook received without X-Fleeca-Signature header')
      return { status: 403, body: 'Forbidden' }
    }

    if (!fleecaClient.verifyWebhookSignature(rawBody, signature)) {
      logger.warn('Fleeca webhook signature verification failed')
      return { status: 403, body: 'Forbidden' }
    }

    let payload: unknown
    try {
      payload = JSON.parse(rawBody)
    } catch (err) {
      logger.error({ err }, 'Fleeca webhook body is not valid JSON')
      return { status: 200, body: 'OK' }
    }

    if (!isValidWebhookPayload(payload)) {
      logger.error({ rawBody }, 'Fleeca webhook payload is malformed')
      return { status: 400, body: 'Bad Request' }
    }

    try {
      const pending = await pendingPaymentRepository.findById(payload.payment_id)
      if (!pending) {
        logger.warn(
          { paymentId: payload.payment_id },
          'Webhook for unknown or already-processed payment — ignored'
        )
        return { status: 200, body: 'OK' }
      }

      if (inProd && pending.mode === FLEECA_PAYMENT_MODE.SANDBOX) {
        logger.error(
          { paymentId: pending.id },
          'Sandbox payment webhook received in production — rejected'
        )
        return { status: 500, body: 'Internal Server Error' }
      }

      const expectedMode = pending.mode === FLEECA_PAYMENT_MODE.LIVE ? 'live' : 'sandbox'
      if (payload.amount !== pending.amount || payload.mode !== expectedMode) {
        logger.error(
          {
            paymentId: pending.id,
            expectedAmount: pending.amount,
            receivedAmount: payload.amount,
            expectedMode,
            receivedMode: payload.mode,
          },
          'Fleeca webhook payload mismatch with pending payment'
        )
        return { status: 500, body: 'Internal Server Error' }
      }

      if (pending.expiresAt < new Date() && payload.status === 'pending') {
        logger.warn({ paymentId: pending.id }, 'Webhook for an expired payment still pending')
        await pendingPaymentRepository.deleteById(pending.id)
        return { status: 200, body: 'OK' }
      }

      if (payload.status === 'pending') {
        return { status: 200, body: 'OK' }
      }

      const claimed = await pendingPaymentRepository.claimAndDeleteById(payload.payment_id)
      if (!claimed) {
        logger.warn(
          { paymentId: payload.payment_id },
          'Webhook for an already-processed payment — ignored'
        )
        return { status: 200, body: 'OK' }
      }

      await this.#runPaymentHandler(claimed, payload.status)

      return { status: 200, body: 'OK' }
    } catch (err) {
      logger.error(
        { err, paymentId: payload.payment_id },
        'Webhook processing error — returning 500 so Fleeca retries'
      )
      return { status: 500, body: 'Internal Server Error' }
    }
  }

  async #runPaymentHandler(
    payment: PendingPayment,
    status: Exclude<FleecaWebhookPayload['status'], 'pending'>
  ): Promise<void> {
    const handler = paymentHandlerRegistry.resolve(payment.source)
    try {
      if (status === 'payment_successful') {
        await handler.onSuccess(payment)
      } else {
        await handler.onFailure?.(payment)
      }
    } catch (err) {
      logger.error(
        { err, paymentId: payment.id },
        'Payment handler failed — restoring pending payment so Fleeca can retry'
      )
      await pendingPaymentRepository.create(payment)
      throw err
    }
  }
}

export const paymentService = new PaymentService()
