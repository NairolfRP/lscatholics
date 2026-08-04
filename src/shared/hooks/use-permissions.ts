import type { PermissionMap } from '#/shared/utils/permissions'
import { useGameContext } from './use-game-context'

export function usePermissions(): PermissionMap {
  const { permissions } = useGameContext()
  return permissions
}
