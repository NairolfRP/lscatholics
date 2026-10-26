import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { deletePostFn, sendPostNotificationFn } from '#/server-fn/post.functions.ts'
import { DashboardListSkeletonRows } from '#/shared/components/dashboard/list-skeleton-rows.tsx'
import { toast } from '#/shared/components/ui/toast'
import { usePermissions } from '#/shared/hooks/use-permissions'
import { authClient } from '#/shared/integrations/auth/auth-client.ts'
import { hasPermission } from '#/shared/utils/permissions'
import { DashboardList } from '#shared/components/dashboard/list.tsx'
import {
  DASHBOARD_LIST_INITIAL_FILTERS,
  DASHBOARD_PAGINATION_LIMIT,
} from '#shared/constants/dashboard.ts'
import { useDashboardList } from '#shared/hooks/dashboard/use-dashboard-list.tsx'
import { postsDashboardQueryOptions } from '#shared/queries/post.queries.ts'
import type { DashboardPostsTableMeta } from '../types/dashboard-post.types'
import { dashboardPostColumns } from '../constants/dashboard-post-columns'
import { dashboardPostsListSkeletonRows } from '../constants/dashboard-posts-list-skeleton-rows'
import { canEditPost } from '../utils/post.utils'

export function DashboardPostsList() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { data: session, isPending: isSessionPending } = authClient.useSession()
  const permissions = usePermissions()

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

  const sendNotificationMutation = useMutation({
    mutationFn: async (postId: string) => {
      const result = await sendPostNotificationFn({ data: { postId } })

      if (!result.success) {
        return { error: true, message: result.error ?? '(( Une erreur est survenue ))' }
      }

      toast.success('(( Notification Discord envoyée ! ))')
      void queryClient.invalidateQueries({ queryKey: ['posts'] })
      return { error: false }
    },
    onError: () => {
      return { error: true, message: '(( Une erreur est survenue ))' }
    },
  })

  if (isSessionPending || list.isPending) {
    return <DashboardListSkeletonRows rows={dashboardPostsListSkeletonRows} />
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
          canEditPost: (authorId) => canEditPost({ user: session!.user, authorId }),
          canUpdatePost: (authorId) =>
            hasPermission(permissions, 'post', 'update') &&
            canEditPost({ user: session!.user, authorId }),
          canDeletePost: (authorId) =>
            hasPermission(permissions, 'post', 'delete') &&
            canEditPost({ user: session!.user, authorId }),
          onDelete: (postId) => deletePostMutation.mutateAsync(postId),
          onSendNotification: (postId) => sendNotificationMutation.mutateAsync(postId),
        } satisfies DashboardPostsTableMeta
      }
    />
  )
}
