import type { ActionReturnType } from '#/shared/types/action.types.ts'

export type DashboardChurchEventsTableMeta = {
  canUpdate: boolean
  canDelete: boolean
  onDelete: (churchEventId: string) => ActionReturnType
}
