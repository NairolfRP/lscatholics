import { createServerFn } from '@tanstack/react-start'
import { setPublicCache } from '#server/lib/http-cache'
import * as latestEventsService from '#server/services/latest-events.service'

export const getLatestEventsFn = createServerFn({ method: 'GET' }).handler(async () => {
  setPublicCache({ maxAge: 60, sMaxAge: 300, staleWhileRevalidate: 3600 })
  return latestEventsService.getLatestEvents()
})
