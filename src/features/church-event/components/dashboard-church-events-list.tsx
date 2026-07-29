import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { dashboardChurchEventColumns } from '#/features/church-event/constants/dashboard-church-event-columns.tsx'
import type { DashboardChurchEventsTableMeta } from '#/features/church-event/types/dashboard-church-event.types.ts'
import { deleteChurchEventFn } from '#/server-fn/church-event.functions.ts'
import { toast } from '#/shared/components/ui/toast'
import { DashboardList } from '#shared/components/dashboard/list.tsx'
import { Spinner } from '#shared/components/ui/spinner.tsx'
import {
  DASHBOARD_LIST_INITIAL_FILTERS,
  DASHBOARD_PAGINATION_LIMIT,
} from '#shared/constants/dashboard.ts'
import { useDashboardList } from '#shared/hooks/dashboard/use-dashboard-list.tsx'
import { churchEventsDashboardQueryOptions } from '#shared/queries/church-event.queries.ts'

export function DashboardChurchEventsList() {
  const router = useRouter()
  const queryClient = useQueryClient()

  const list = useDashboardList({
    routeId: '/dashboard/events/',
    initialFilters: { ...DASHBOARD_LIST_INITIAL_FILTERS, sortBy: 'startDate.asc' },
    queryOptions: churchEventsDashboardQueryOptions,
    pageSize: DASHBOARD_PAGINATION_LIMIT,
  })

  const deleteChurchEventMutation = useMutation({
    mutationFn: async (churchEventId: string) => {
      await deleteChurchEventFn({ data: { churchEventId } })

      toast.success("L'événement a été supprimé")
      void queryClient.invalidateQueries({ queryKey: ['events'] })
      return { error: false }
    },
    onError: (error) => {
      if (error.message === 'Church Event not found') {
        void queryClient.invalidateQueries({ queryKey: ['events'] })
        return { error: true, message: 'Cet événement semble avoir déjà été supprimé.' }
      }
      return { error: true, message: 'Une erreur est survenue' }
    },
  })

  if (list.isPending) {
    return <Spinner />
  }

  if (list.isError) {
    return <p>Une erreur est survenue</p>
  }

  return (
    <DashboardList
      columns={dashboardChurchEventColumns}
      data={list.data?.churchEvents}
      total={list.data?.total}
      entityLabel="événements"
      pagination={list.paginationState}
      onPaginationChange={list.onPaginationChange}
      sorting={list.sortingState}
      onSortingChange={list.onSortingChange}
      filters={list.filters}
      onFilterChange={(partialFilters: Partial<typeof list.filters>) => {
        void list.setFilters(partialFilters)
        if ('search' in partialFilters) {
          void router.invalidate()
        }
      }}
      isDefaultFilters={list.isDefaultFilters}
      onResetFilters={list.resetFilters}
      meta={
        {
          onDelete: (churchEventId) => deleteChurchEventMutation.mutateAsync(churchEventId),
        } satisfies DashboardChurchEventsTableMeta
      }
    />
  )
}
