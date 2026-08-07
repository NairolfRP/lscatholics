import { eq, lt } from 'drizzle-orm'
import { pendingPayments } from '#server/db/schema/pending-payment-schema.ts'
import { BaseRepository } from '#server/repositories/base.repository.ts'

export type PendingPayment = typeof pendingPayments.$inferSelect
export type NewPendingPayment = typeof pendingPayments.$inferInsert

class PendingPaymentRepository extends BaseRepository<typeof pendingPayments> {
  constructor() {
    super(undefined, pendingPayments)
  }

  async findById(id: string) {
    return this.db.query.pendingPayments.findFirst({
      where: eq(pendingPayments.id, id),
    })
  }

  async findExpired(now = new Date()) {
    return this.db.query.pendingPayments.findMany({
      where: lt(pendingPayments.expiresAt, now),
    })
  }

  async deleteById(id: string): Promise<void> {
    await this.db.delete(pendingPayments).where(eq(pendingPayments.id, id))
  }

  /**
   * Atomically claim and remove a pending payment. Returns the claimed row, or
   * `undefined` if it was already removed (e.g. by a concurrent webhook).
   */
  async claimAndDeleteById(id: string): Promise<PendingPayment | undefined> {
    const [claimed] = await this.db
      .delete(pendingPayments)
      .where(eq(pendingPayments.id, id))
      .returning()

    return claimed
  }
}

export const pendingPaymentRepository = new PendingPaymentRepository()
