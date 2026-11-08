import type { User } from '#/shared/lib/types/auth'
import type { ActionReturnType } from '#/shared/types/action.types'

export type UsersTableMeta = {
  currentUserId: string
  canDeleteUsers: boolean
  onUnban: (targetId: string) => ActionReturnType
  onBanSuccess: (params: { bannedUser: User; closeDialog: () => void }) => void
  onDelete: (targetId: string) => ActionReturnType
}
