import { queryOptions } from '@tanstack/react-query'
import { getLatestEventsFn } from './functions/latest-events.functions'

export const latestEventsQueryOptions = queryOptions({
  queryKey: ['events', 'latest'],
  queryFn: () => getLatestEventsFn(),
})
