import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { toast } from 'sonner'
import {
  dashboardJobPostingColumns,
} from '#/features/job-posting/constants/dashboard-job-posting-columns.tsx'
import type {
  DashboardJobPostingsTableMeta,
} from '#/features/job-posting/types/job-posting.types.ts'
import {
  jobPostingDeleteFn,
  toggleJobPostingActiveStateFn,
} from '#/server-fn/job-posting.functions.ts'
import { isAdmin } from '#/utils/user.ts'
import { DashboardList } from '#shared/components/dashboard/list.tsx'
import { Spinner } from '#shared/components/ui/spinner.tsx'
import {
  DASHBOARD_LIST_INITIAL_FILTERS,
  DASHBOARD_PAGINATION_LIMIT,
} from '#shared/constants/dashboard.ts'
import { useDashboardList } from '#shared/hooks/dashboard/use-dashboard-list.tsx'
import { authClient } from '#shared/integrations/auth/auth-client.ts'
import { jobPostingsDashboardQueryOptions } from '#shared/queries/job-posting.queries.ts'

export function DashboardJobPostingsList() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { data: session, isPending: isSessionPending } = authClient.useSession()

  const list = useDashboardList({
    routeId: '/dashboard/job-openings/',
    initialFilters: DASHBOARD_LIST_INITIAL_FILTERS,
    queryOptions: jobPostingsDashboardQueryOptions,
    pageSize: DASHBOARD_PAGINATION_LIMIT,
  })

  const toggleJobPostingActiveStateMutation = useMutation({
    mutationFn: async (jobPostingId: string) => {
      if (!session || !isAdmin(session.user)) {
        return { error: true, message: "Vous n'êtes pas autorisé à faire ça." }
      }

      const result = await toggleJobPostingActiveStateFn({ data: { jobPostingId } })

      toast.success(
        <>
          L'offre d'emploi a été <strong>{result.state ? 'rouverte' : 'fermée'}</strong>
        </>
      )
      void queryClient.invalidateQueries({ queryKey: ['job-postings'] })
      return { error: false }
    },
    onError: (error) => {
      if (error.message === 'Job Posting not found') {
        void queryClient.invalidateQueries({ queryKey: ['job-postings'] })
        return { error: true, message: "Cette n'offre n'existe pas ou plus." }
      }
      return { error: true, message: 'Une erreur est survenue' }
    },
  })

  const deleteJobPostingMutation = useMutation({
    mutationFn: async (jobPostingId: string) => {
      await jobPostingDeleteFn({ data: { jobPostingId } })

      toast.success("L'offre d'emploi a été supprimée")
      void queryClient.invalidateQueries({ queryKey: ['job-postings'] })
      return { error: false }
    },
    onError: (error) => {
      if (error.message === 'Job Posting not found') {
        void queryClient.invalidateQueries({ queryKey: ['job-postings'] })
        return { error: true, message: 'Cette offre semble avoir déjà été supprimée.' }
      }
      return { error: true, message: 'Une erreur est survenue' }
    },
  })

  if (isSessionPending || list.isPending) {
    return <Spinner />
  }

  if (list.isError) {
    return <p>Une erreur est survenue</p>
  }

  return (
    <DashboardList
      columns={dashboardJobPostingColumns}
      data={list.data?.jobPostings}
      total={list.data?.total}
      entityLabel="offres d'emplois"
      pagination={list.paginationState}
      onPaginationChange={list.onPaginationChange}
      sorting={list.sortingState}
      onSortingChange={list.onSortingChange}
      filters={list.filters}
      onFilterChange={(partialFilters) => {
        void list.setFilters(partialFilters)
        if ('search' in partialFilters) {
          void router.invalidate()
        }
      }}
      isDefaultFilters={list.isDefaultFilters}
      onResetFilters={list.resetFilters}
      meta={
        {
          canDelete: !session ? false : isAdmin(session.user),
          onDelete: (jobPostingId) => deleteJobPostingMutation.mutateAsync(jobPostingId),
          onToggleActiveState: (jobPostingId) =>
            toggleJobPostingActiveStateMutation.mutateAsync(jobPostingId),
        } satisfies DashboardJobPostingsTableMeta
      }
    />
  )
}
