import type { QueryKey, queryOptions } from '@tanstack/react-query'
import { useQuery } from '@tanstack/react-query'
import type { RegisteredRouter, RouteIds } from '@tanstack/react-router'
import type { PaginationState, SortingState, Updater } from '@tanstack/react-table'
import { sortByToState, stateToSortBy } from '#/utils/table.ts'
import { DASHBOARD_PAGINATION_LIMIT } from '#shared/constants/dashboard.ts'
import { useFilters } from '#shared/hooks/use-filters.tsx'
import type { DashboardFilters } from '#shared/schemas/dashboard/search.schema.ts'

interface UseDashboardListParams<
  TRouteId extends RouteIds<RegisteredRouter['routeTree']>,
  TFilters extends DashboardFilters,
  TData,
  TQueryKey extends QueryKey,
> {
  routeId: TRouteId
  initialFilters: TFilters
  queryOptions: (
    filters: TFilters
  ) => ReturnType<typeof queryOptions<TData, Error, TData, TQueryKey>>
  pageSize?: number
}

export function useDashboardList<
  TRouteId extends RouteIds<RegisteredRouter['routeTree']>,
  TFilters extends DashboardFilters,
  TData,
  TQueryKey extends QueryKey,
>({
  routeId,
  initialFilters,
  queryOptions,
  pageSize = DASHBOARD_PAGINATION_LIMIT,
}: UseDashboardListParams<TRouteId, TFilters, TData, TQueryKey>) {
  const { filters: rawFilters, resetFilters, setFilters } = useFilters(routeId)
  const filters = rawFilters as unknown as TFilters
  const { data, isPending, isError } = useQuery(queryOptions(filters))

  const paginationState = { pageIndex: filters.page, pageSize }
  const sortingState = sortByToState(
    filters.sortBy as `${string}.asc` | `${string}.desc` | undefined
  )

  const isDefaultFilters = (Object.keys(initialFilters) as (keyof TFilters)[]).every(
    (key) => filters[key] === initialFilters[key]
  )

  return {
    filters,
    setFilters,
    resetFilters,
    isDefaultFilters,
    data,
    isPending,
    isError,
    paginationState,
    sortingState,
    onPaginationChange: (pagination: Updater<PaginationState>) => {
      if (typeof pagination === 'function') {
        const resolved = pagination(paginationState)
        return setFilters({ page: resolved.pageIndex } as unknown as Parameters<
          typeof setFilters
        >[0])
      }
      return setFilters({ page: pagination.pageIndex } as unknown as Parameters<
        typeof setFilters
      >[0])
    },
    onSortingChange: (updaterOrValue: Updater<SortingState>) => {
      const newSorting =
        typeof updaterOrValue === 'function' ? updaterOrValue(sortingState) : updaterOrValue
      return setFilters({ sortBy: stateToSortBy(newSorting) } as unknown as Parameters<
        typeof setFilters
      >[0])
    },
  }
}
