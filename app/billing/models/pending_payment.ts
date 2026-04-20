import { PendingPaymentSchema } from '#database/schema'
import { column } from '@adonisjs/lucid/orm'
import type { FleecaPaymentMode } from '#billing/types/payment'
import encryption from '@adonisjs/core/services/encryption'

export default class PendingPayment extends PendingPaymentSchema {
  static table = 'pending_payments'

  @column()
  declare mode: FleecaPaymentMode

  @column({
    prepare: (v: Record<string, unknown>) => encryption.encrypt(JSON.stringify(v)),
    consume: (v: string) => JSON.parse(encryption.decrypt(v) as string),
  })
  declare metadata: Record<string, unknown>
}
