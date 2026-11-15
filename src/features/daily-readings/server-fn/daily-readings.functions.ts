import { createServerFn } from '@tanstack/react-start'
import { getDailyReadings } from '#/features/daily-readings/api/daily-readings.api.ts'
import { readingsDateSchema } from '#/features/daily-readings/schemas/daily-readings.schema.ts'
import { logger } from '#server/integrations/logger'
import { setPublicCache } from '#server/lib/http-cache'

/** Seconds remaining until next midnight in Europe/Paris. */
function secondsUntilMidnightParis(now: Date = new Date()): number {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Paris',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).formatToParts(now)
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value ?? '0')
  const secondsSinceMidnight = get('hour') * 3600 + get('minute') * 60 + get('second')
  return Math.max(60, 86400 - secondsSinceMidnight)
}

export const getDailyReadingsFn = createServerFn({ method: 'GET' })
  .validator(readingsDateSchema)
  .handler(async ({ data: date }) => {
    const ttl = secondsUntilMidnightParis()
    setPublicCache({
      maxAge: ttl,
      sMaxAge: ttl,
      staleWhileRevalidate: 86400,
    })
    try {
      return await getDailyReadings(date)
    } catch (err) {
      // Graceful fallback: do not break the page if AELF is temporarily unavailable.
      logger.warn({ err, date }, 'AELF readings unavailable')
      return null
    }
  })
