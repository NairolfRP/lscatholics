import type { ActionButtonReturnType } from '#/shared/components/action-button.tsx'

export type DashboardPostsTableMeta = {
  canEditPost: (authorId: string | null) => boolean
  canUpdatePost: (authorId: string | null) => boolean
  canDeletePost: (authorId: string | null) => boolean
  onDelete: (postId: string) => ActionButtonReturnType
}
