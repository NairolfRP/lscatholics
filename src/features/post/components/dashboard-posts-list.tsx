import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { toast } from 'sonner'
import { DashboardList } from '#shared/components/dashboard/list.tsx'
import { useDashboardList } from '#shared/hooks/dashboard/use-dashboard-list.tsx'
import { Skeleton } from '#/shared/components/ui/skeleton.tsx'
import {
  Table as TableShadcn,
  TableBody,
  TableCell,
  TableRow,
} from '#/shared/components/ui/table.tsx'
import { authClient } from '#/shared/integrations/auth/auth-client.ts'
import {
  DASHBOARD_LIST_INITIAL_FILTERS,
  DASHBOARD_PAGINATION_LIMIT,
} from '#shared/constants/dashboard.ts'
import { postsDashboardQueryOptions } from '#shared/queries/post.queries.ts'
import type { DashboardPostsTableMeta } from '../types/dashboard-post.types'
import { dashboardPostColumns } from '../constants/dashboard-post-columns'
import { deletePostFn } from '../../../server-fn/post.functions.ts'
import { canEditPost } from '../utils/post.utils'

export function DashboardPostsList() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { data: session, isPending: isSessionPending } = authClient.useSession()

  const list = useDashboardList({
    routeId: '/dashboard/posts/',
    initialFilters: DASHBOARD_LIST_INITIAL_FILTERS,
    queryOptions: postsDashboardQueryOptions,
    pageSize: DASHBOARD_PAGINATION_LIMIT,
  })

  const deletePostMutation = useMutation({
    mutationFn: async (postId: string) => {
      await deletePostFn({ data: { postId } })

      toast.success("L'article a été supprimé")
      void queryClient.invalidateQueries({ queryKey: ['posts'] })
      return { error: false }
    },
    onError: (error) => {
      if (error.message === 'Post not found') {
        void queryClient.invalidateQueries({ queryKey: ['posts'] })
        return { error: true, message: 'Ce poste semble avoir déjà été supprimé.' }
      }
      return { error: true, message: 'Une erreur est survenue' }
    },
  })

  if (isSessionPending || list.isPending) {
    return <DashboardPostsListSkeletonRows />
  }

  if (list.isError) {
    return <p>Une erreur est survenue</p>
  }

  return (
    <DashboardList
      columns={dashboardPostColumns}
      data={list.data?.posts}
      total={list.data?.total}
      entityLabel="articles"
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
          canEditPost: (authorId) => canEditPost({ user: session!.user, authorId }),
          onDelete: (postId) => deletePostMutation.mutateAsync(postId),
        } satisfies DashboardPostsTableMeta
      }
    />
  )
}

function DashboardPostsListSkeletonRows() {
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
