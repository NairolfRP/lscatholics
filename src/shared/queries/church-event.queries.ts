import { queryOptions } from '@tanstack/react-query'
import { getLatestEventsFn } from '#/server-fn/latest-events.functions.ts'

export const latestEventsQueryOptions = queryOptions({
  queryKey: ['events', 'latest'],
  queryFn: () => getLatestEventsFn(),
})
