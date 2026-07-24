import { defineTask } from 'nitro/task'
import { logger } from '#server/integrations/logger.ts'
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

      logger.debug('%d church events deleted', nbOfDeletedChurchEvents)

      return {
        result: 'Cleaning successfully completed',
        churchEventsDeleted: nbOfDeletedChurchEvents,
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
