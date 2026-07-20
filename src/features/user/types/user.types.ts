import type { ActionButtonReturnType } from '#/shared/components/action-button'
import type { User } from '#/shared/lib/types/auth'

export type UsersTableMeta = {
  currentUserId: string
  canDeleteUsers: boolean
  onUnban: (targetId: string) => ActionButtonReturnType
  onBanSuccess: (params: { bannedUser: User; closeDialog: () => void }) => void
  onDelete: (targetId: string) => ActionButtonReturnType
}
