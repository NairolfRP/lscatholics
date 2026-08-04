import type { ActionButtonReturnType } from '#/shared/components/action-button.tsx'

export type DashboardChurchEventsTableMeta = {
  canUpdate: boolean
  canDelete: boolean
  onDelete: (churchEventId: string) => ActionButtonReturnType
}
