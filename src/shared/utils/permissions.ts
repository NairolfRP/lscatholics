import type { statement } from '#shared/integrations/auth/access-control'

export type PermissionMap = Record<string, string[]>

export type PermissionResource = keyof typeof statement
export type PermissionAction<R extends PermissionResource> = (typeof statement)[R][number]

export function hasPermission(
  permissions: PermissionMap | undefined,
  resource: string,
  action: string
): boolean {
  return permissions?.[resource]?.includes(action) ?? false
}
