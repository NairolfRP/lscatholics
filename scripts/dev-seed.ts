import { fr } from '@faker-js/faker'
import { churchEventFactory } from '#/server/db/factories/church-event-factory'
import { postFactory } from '#/server/db/factories/post-factory'
import { logger } from '#/server/integrations/logger'

if (process.env.NODE_ENV === 'production') {
  throw new Error('This seed is only for development.')
}

async function seed() {
  logger.info('🌱 [Development] Seeding...')
  await Promise.all([
    postFactory.withLocale(fr).insert(50),
    churchEventFactory.withLocale(fr).insert(50),
  ])
  logger.info('✅ Done')
  process.exit(0)
}

seed().catch((err) => {
  logger.error({ err }, '❌ [Development] Seeding has failed')
  process.exit(1)
})
