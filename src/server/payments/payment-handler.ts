import type { PendingPayment } from '#server/repositories/pending-payment.repository.ts'

/**
 * Handles source-specific side effects when a payment reaches a terminal state.
 * Implementations self-register on the {@link paymentHandlerRegistry}.
 */
export interface PaymentHandler {
  /** Unique source identifier, e.g. "donation" */
  readonly source: string
  onSuccess: (payment: PendingPayment) => Promise<void>
  onFailure?: (payment: PendingPayment) => Promise<void>
}

export class PaymentHandlerRegistry {
  readonly #handlers = new Map<string, PaymentHandler>()

  register(handler: PaymentHandler): this {
    this.#handlers.set(handler.source, handler)
    return this
  }

  has(source: string): boolean {
    return this.#handlers.has(source)
  }

  resolve(source: string): PaymentHandler {
    const handler = this.#handlers.get(source)
    if (!handler) {
      throw new Error(`No payment handler registered for source "${source}"`)
    }
    return handler
  }
}

export const paymentHandlerRegistry = new PaymentHandlerRegistry()
