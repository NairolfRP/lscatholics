import { defineTask } from 'nitro/task'
import '#/features/donate/server/donation-payment.handler'
import { logger } from '#server/integrations/logger.ts'
import { paymentService } from '#server/payments/payment.service.ts'
import { churchEventRepository } from '#server/repositories/church-event.repository.ts'

export default defineTask({
  meta: {
    name: 'cleanup',
    description: 'Cleans up expired items from the database',
  },
  async run() {
    logger.debug('Starting the cleanup task...')

    try {
      const nbOfDeletedChurchEvents = await churchEventRepository.cleanup()
      const { reconciled, deleted } = await paymentService.reconcileExpiredPayments()

      logger.debug(
        '%d church events deleted, %d pending payments reconciled and %d deleted',
        nbOfDeletedChurchEvents,
        reconciled,
        deleted
      )

      return {
        result: 'Cleaning successfully completed',
        churchEventsDeleted: nbOfDeletedChurchEvents,
        pendingPaymentsReconciled: reconciled,
        pendingPaymentsDeleted: deleted,
        timestamp: new Date().toISOString(),
      }
    } catch (err) {
      logger.error({ err }, 'Critical error during the cleanup task')
      return {
        result: 'Cleanup task failed',
        error: String(err),
      }
    }
  },
})
