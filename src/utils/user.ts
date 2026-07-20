import type { User } from '#/shared/lib/types/auth.ts'
import { parseCsvString } from './string'

export function isAdmin(user: User): boolean {
  if (!user.role || user.role.trim() === '') return false

  const roles = user.role ? parseCsvString(user.role) : []

  return roles.includes('admin')
}
