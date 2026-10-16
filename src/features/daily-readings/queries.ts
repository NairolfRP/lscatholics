import { queryOptions } from '@tanstack/react-query'
import { getDailyReadingsFn } from '#/features/daily-readings/server-fn/daily-readings.functions.ts'

export const dailyReadingsQueryOptions = (date: string) => {
  return queryOptions({
    queryKey: ['daily-readings', date],
    queryFn: () => getDailyReadingsFn({ data: date }),
    staleTime: 60 * 60 * 1000, // 1 hour — a date's readings never change
    gcTime: 24 * 60 * 60 * 1000,
    retry: 1,
  })
}
