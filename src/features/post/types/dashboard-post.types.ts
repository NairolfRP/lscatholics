import type { ActionReturnType } from '#/shared/types/action.types.ts'

export type DashboardPostsTableMeta = {
  canEditPost: (authorId: string | null) => boolean
  canUpdatePost: (authorId: string | null) => boolean
  canDeletePost: (authorId: string | null) => boolean
  onDelete: (postId: string) => ActionReturnType
  onSendNotification: (postId: string) => ActionReturnType
}
