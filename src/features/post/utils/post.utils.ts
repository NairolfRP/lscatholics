import type { User } from '#/shared/lib/types/auth.ts'
import { isAdmin } from '#/utils/user.ts'

export function canEditPost({ user, authorId }: { user: User; authorId: string | null }): boolean {
  if (isAdmin(user)) {
    return true
  }

  if (!authorId || user.id !== authorId) {
    return false
  }

  return true
}
