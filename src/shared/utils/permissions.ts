export type PermissionMap = Record<string, string[]>

export function hasPermission(
  permissions: PermissionMap | undefined,
  resource: string,
  action: string
): boolean {
  return permissions?.[resource]?.includes(action) ?? false
}
