import { DashboardListSkeletonRows } from '#/shared/components/dashboard/list-skeleton-rows.tsx'
import { authClient } from '#/shared/integrations/auth/auth-client.ts'
import { DashboardList } from '#shared/components/dashboard/list.tsx'
import {
  DASHBOARD_LIST_INITIAL_FILTERS,
  DASHBOARD_PAGINATION_LIMIT,
} from '#shared/constants/dashboard.ts'
import { useDashboardList } from '#shared/hooks/dashboard/use-dashboard-list.tsx'
import type { UsersTableMeta } from '../../types/user.types'
import { userColumns } from '../../constants/dashboard-user-columns'
import { useUserAdminMutations } from '../../hooks/use-user-admin-mutations'
import { usersListQueryOptions } from '../../queries'

const skeletonRows = [
  [
    { widths: ['h-4 w-36'] },
    { widths: ['h-5 w-16', 'h-5 w-20'] },
    { widths: ['h-4 w-24'] },
    { widths: ['size-5', 'size-5', 'size-5'], contentClassName: 'flex justify-end gap-2' },
  ],
  [
    { widths: ['h-4 w-44'] },
    { widths: ['h-5 w-20'] },
    { widths: ['h-4 w-20'] },
    { widths: ['size-5', 'size-5'], contentClassName: 'flex justify-end gap-2' },
  ],
  [
    { widths: ['h-4 w-32'] },
    { widths: ['h-5 w-16', 'h-5 w-24', 'h-5 w-20'] },
    { widths: ['h-4 w-24'] },
    { widths: ['size-5', 'size-5', 'size-5'], contentClassName: 'flex justify-end gap-2' },
  ],
  [
    { widths: ['h-4 w-40'] },
    { widths: ['h-5 w-20', 'h-5 w-16'] },
    { widths: ['h-4 w-20'] },
    { widths: ['size-5'], contentClassName: 'flex justify-end gap-2' },
  ],
  [
    { widths: ['h-4 w-28'] },
    { widths: ['h-5 w-16'] },
    { widths: ['h-4 w-24'] },
    { widths: ['size-5', 'size-5'], contentClassName: 'flex justify-end gap-2' },
  ],
]

function hasPermission(_user: { id: string }, _permission: 'deleteUsers'): boolean {
  return true
}

export function UsersList() {
  const { data: session, isPending: isSessionPending } = authClient.useSession()

  const list = useDashboardList({
    routeId: '/dashboard/users/',
    initialFilters: DASHBOARD_LIST_INITIAL_FILTERS,
    queryOptions: usersListQueryOptions,
    pageSize: DASHBOARD_PAGINATION_LIMIT,
  })

  const { deleteUserMutation, unbanUserMutation, handleBanSuccess } = useUserAdminMutations(
    list.filters
  )

  if (isSessionPending || list.isPending) {
    return <DashboardListSkeletonRows rows={skeletonRows} />
  }

  if (list.isError) {
    return <p>Une erreur est survenue</p>
  }

  return (
    <DashboardList
      columns={userColumns}
      data={list.data?.users}
      total={list.data?.total}
      entityLabel="utilisateurs"
      pagination={list.paginationState}
      onPaginationChange={list.onPaginationChange}
      sorting={list.sortingState}
      onSortingChange={list.onSortingChange}
      filters={list.filters}
      onFilterChange={list.setFilters}
      isDefaultFilters={list.isDefaultFilters}
      onResetFilters={list.resetFilters}
      meta={
        {
          currentUserId: session!.user.id,
          canDeleteUsers: hasPermission(session!.user, 'deleteUsers'),
          onUnban: unbanUserMutation.mutateAsync,
          onBanSuccess: handleBanSuccess,
          onDelete: deleteUserMutation.mutateAsync,
        } satisfies UsersTableMeta
      }
    />
  )
}
