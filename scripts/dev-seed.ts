import { fr } from '@faker-js/faker'
import { churchEventFactory } from '#/server/db/factories/church-event-factory'
import { postFactory } from '#/server/db/factories/post-factory'
import { logger } from '#/server/integrations/logger'

if (process.env.NODE_ENV === 'production') {
  throw new Error('This seed is only for development.')
}

async function seed() {
  console.log('🌱 [Development] Seeding...')
  await Promise.all([
    postFactory.withLocale(fr).insert(50),
    churchEventFactory.withLocale(fr).insert(50),
  ])
  console.log('✅ Done')
  process.exit(0)
}

seed().catch((err) => {
  console.error('❌ [Development] Seeding has failed', { err })
  process.exit(1)
})
