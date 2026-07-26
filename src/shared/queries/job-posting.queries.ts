import { queryOptions } from '@tanstack/react-query'
import { getDashboardJobPostingsFn } from '#/server-fn/job-posting.functions.ts'
import type { DashboardSearch } from '#shared/schemas/dashboard/search.schema.ts'

export const jobPostingsDashboardQueryOptions = (deps: DashboardSearch) => {
  return queryOptions({
    queryKey: ['job-postings', 'dashboard', deps],
    queryFn: () => getDashboardJobPostingsFn({ data: deps }),
    staleTime: 5 * 60_000, // 5 minutes,
  })
}
