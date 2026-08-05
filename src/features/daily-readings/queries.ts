import { queryOptions } from '@tanstack/react-query'
import { getDailyReadings } from '#/features/daily-readings/api/daily-readings.api.ts'

export const dailyReadingsQueryOptions = (date: string) => {
  return queryOptions({
    queryKey: ['daily-readings', date],
    queryFn: () => getDailyReadings(date),
    staleTime: 60 * 60 * 1000, // 1 hour — a date's readings never change
    gcTime: 24 * 60 * 60 * 1000,
    retry: 1,
  })
}
