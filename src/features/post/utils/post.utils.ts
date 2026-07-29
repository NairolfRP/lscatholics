import { generateExcerpt } from '#/utils/string.ts'
import { isAdmin } from '#/utils/user.ts'
import { POST_STATUS } from '#shared/constants/post-status.ts'
import type { User } from '#shared/lib/types/auth.ts'

export function canEditPost({ user, authorId }: { user: User; authorId: string | null }): boolean {
  if (isAdmin(user)) {
    return true
  }

  return Boolean(authorId) && user.id === authorId
}

export function resolveExcerpt(excerpt: string | undefined, content: string): string {
  if (excerpt) return excerpt
  return generateExcerpt(content, 150)
}

export function resolvePublishedAt(
  publishedAt: Date | null | undefined,
  status: string
): Date | null {
  if (publishedAt !== undefined) return publishedAt
  if (status === POST_STATUS.PUBLISHED) return new Date()
  return null
}
