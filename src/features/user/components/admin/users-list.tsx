import { DashboardList } from '#/features/dashboard/components/dashboard-list.tsx'
import { DASHBOARD_PAGINATION_LIMIT } from '#/features/dashboard/constants/dashboard-pagination.ts'
import { DASHBOARD_LIST_INITIAL_FILTERS } from '#/features/dashboard/constants/dashboard.constants.ts'
import { useDashboardList } from '#/features/dashboard/hooks/use-dashboard-list.tsx'
import { Skeleton } from '#/shared/components/ui/skeleton.tsx'
import {
  TableBody,
  TableCell,
  TableRow,
  Table as TableShadcn,
} from '#/shared/components/ui/table.tsx'
import { authClient } from '#/shared/integrations/auth/auth-client.ts'
import type { UsersTableMeta } from '../../types/user.types'
import { userColumns } from '../../constants/dashboard-user-columns'
import { useUserAdminMutations } from '../../hooks/use-user-admin-mutations'
import { usersListQueryOptions } from '../../queries'

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
    return <UsersListSkeletonRows />
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

export function UsersListSkeletonRows() {
  return (
    <div>
      <TableShadcn>
        <TableBody>
          {Array.from({ length: 5 }).map((_, index) => (
            <TableRow key={index} className="hover:bg-transparent">
              <TableCell className="bg-background">
                <Skeleton className="h-4 w-45" />
              </TableCell>
              <TableCell className="bg-background">
                <div className="flex flex-wrap gap-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </TableCell>
              <TableCell className="bg-background">
                <Skeleton className="h-4 max-w-25" />
              </TableCell>
              <TableCell className="bg-background text-right">
                <div className="flex justify-end gap-2">
                  <Skeleton className="size-5" />
                  <Skeleton className="size-5" />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </TableShadcn>
    </div>
  )
}
