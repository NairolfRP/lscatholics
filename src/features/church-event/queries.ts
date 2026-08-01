import { queryOptions } from '@tanstack/react-query'
import {
  getChurchEventsByYearMonthFn,
  getDashboardChurchEventsFn,
} from '#/features/church-event/server-fn/church-event.functions.ts'
import type { DashboardSearch } from '#shared/schemas/dashboard/search.schema.ts'

export const churchEventsQueryOptions = ({ month, year }: { month: number; year: number }) => {
  return queryOptions({
    queryKey: ['events', year, month],
    queryFn: () => getChurchEventsByYearMonthFn({ data: { year, month } }),
    staleTime: 60_000, // 1 minute
  })
}

export const churchEventsDashboardQueryOptions = (deps: DashboardSearch) => {
  return queryOptions({
    queryKey: ['events', 'dashboard', deps],
    queryFn: () => getDashboardChurchEventsFn({ data: deps }),
    staleTime: 5 * 60_000, // 5 minutes,
  })
}
