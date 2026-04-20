import type { ApplicationService } from '@adonisjs/core/types'
import { FleecaClient } from '#billing/services/fleeca_client'
import { PaymentHandlerRegistry } from '#billing/handlers/payment_handler_registry'

export default class BillingProvider {
  constructor(protected app: ApplicationService) {}

  /**
   * Register bindings to the container
   */
  register() {
    this.app.container.singleton(FleecaClient, () => new FleecaClient())
    this.app.container.singleton(PaymentHandlerRegistry, () => new PaymentHandlerRegistry())
  }

  /**
   * The container bindings have booted
   */
  async boot() {
    const registry = await this.app.container.make(PaymentHandlerRegistry)
    const { DonationPaymentHandler } = await import('#donate/handlers/donation_payment_handler')
    registry.register(await this.app.container.make(DonationPaymentHandler))
  }
}
