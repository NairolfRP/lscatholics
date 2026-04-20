import type { PaymentHandler } from '#billing/types/payment_handler'
import PaymentException from '#billing/exceptions/payment_exception'

/**
 * Registry that maps payment sources to their handlers.
 *
 * Bound as a singleton in `AppProvider.register()` and populated in
 * `AppProvider.boot()` — never instantiate this class directly.
 *
 * @example
 * // providers/app_provider.ts
 * registry.register(await container.make(DonationPaymentHandler))
 */
export class PaymentHandlerRegistry {
  readonly #handlers = new Map<string, PaymentHandler>()

  register(handler: PaymentHandler): this {
    this.#handlers.set(handler.source, handler)
    return this
  }

  resolve(source: string): PaymentHandler {
    const handler = this.#handlers.get(source)
    if (!handler) {
      throw PaymentException.custom(
        `No payment handler registered for source "${source}"`,
        'PROCESSING_ERROR'
      )
    }
    return handler
  }

  has(source: string): boolean {
    return this.#handlers.has(source)
  }

  /** Convenience — list all registered source names (useful for logging / tests). */
  sources(): string[] {
    return [...this.#handlers.keys()]
  }
}
