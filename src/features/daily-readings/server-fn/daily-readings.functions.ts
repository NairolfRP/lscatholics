import { createServerFn } from '@tanstack/react-start'
import { setResponseHeader } from '@tanstack/react-start/server'
import { getDailyReadings } from '#/features/daily-readings/api/daily-readings.api.ts'
import { readingsDateSchema } from '#/features/daily-readings/schemas/daily-readings.schema.ts'

export const getDailyReadingsFn = createServerFn({ method: 'GET' })
  .validator(readingsDateSchema)
  .handler(async ({ data: date }) => {
    setResponseHeader('Cache-Control', 'public, max-age=300, stale-while-revalidate=3600')
    return getDailyReadings(date)
  })
