import type { UserRole } from '../types/role.types'

export const ROLE_HIERARCHY: Record<UserRole, number> = Object.freeze({
  user: 0,
  admin: 1000,
})

export const allRoles = Object.keys(ROLE_HIERARCHY) as Array<UserRole>

export function getUserRoleMaxLevel(userRoles: Array<UserRole>): number {
  // oxlint-disable-next-line typescript/no-unnecessary-condition
  return Math.max(...userRoles.map((r) => ROLE_HIERARCHY[r] ?? 0))
}

export function getRoleLevel(role: UserRole) {
  // oxlint-disable-next-line typescript/no-unnecessary-condition
  return ROLE_HIERARCHY[role] ?? 0
}
