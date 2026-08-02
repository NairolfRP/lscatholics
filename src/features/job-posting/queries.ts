import { keepPreviousData, queryOptions } from '@tanstack/react-query'
import {
  getDashboardJobPostingsFn,
  getJobPostingsFn,
  getSingleJobPostingFn,
} from '#/server-fn/job-posting.functions'
import type { DashboardSearch } from '#shared/schemas/dashboard/search.schema'
import type { DepartmentId } from '#shared/types/department.types.ts'
import type { EmploymentType } from '#shared/types/employment.types.ts'

export const jobPostingsDashboardQueryOptions = (deps: DashboardSearch) => {
  return queryOptions({
    queryKey: ['job-postings', 'dashboard', deps],
    queryFn: () => getDashboardJobPostingsFn({ data: deps }),
    staleTime: 5 * 60_000, // 5 minutes,
  })
}

export const singleJobPostingQueryOptions = (slug: string) => {
  return queryOptions({
    queryKey: ['job-posting', slug],
    queryFn: () => getSingleJobPostingFn({ data: slug }),
    staleTime: 60_000, // 1 minute
  })
}

export const jobPostingsQueryOptions = (filters: {
  page: number
  search?: string
  department?: DepartmentId
  type?: EmploymentType[]
}) => {
  const { page, ...other } = filters
  return queryOptions({
    queryKey: ['job-postings', page, other],
    queryFn: () => getJobPostingsFn({ data: filters }),
    staleTime: 60_000, // 1 minute
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: true,
    retry: 2,
  })
}
