import { queryOptions } from '@tanstack/react-query'
import { getDashboardStatsFn } from '#/features/dashboard/server-fn/dashboard.functions'

export const dashboardStatsQueryOptions = queryOptions({
  queryKey: ['dashboard-stats'],
  queryFn: () => getDashboardStatsFn(),
  staleTime: 15 * 60_000, // 15 minutes
})
