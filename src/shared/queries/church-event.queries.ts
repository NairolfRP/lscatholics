import { queryOptions } from '@tanstack/react-query'
import { getDashboardChurchEventsFn } from '#/server-fn/church-event.functions.ts'
import { getLatestEventsFn } from '#/server-fn/latest-events.functions.ts'
import type { DashboardSearch } from '#shared/schemas/dashboard/search.schema.ts'

export const latestEventsQueryOptions = queryOptions({
  queryKey: ['events', 'latest'],
  queryFn: () => getLatestEventsFn(),
})

export const churchEventsDashboardQueryOptions = (deps: DashboardSearch) => {
  return queryOptions({
    queryKey: ['events', 'dashboard', deps],
    queryFn: () => getDashboardChurchEventsFn({ data: deps }),
    staleTime: 5 * 60_000, // 5 minutes,
  })
}
