import { createServerFn } from '@tanstack/react-start'
import * as latestEventsService from '#server/services/latest-events.service'

export const getLatestEventsFn = createServerFn({ method: 'GET' }).handler(async () => {
  return latestEventsService.getLatestEvents()
})
