import type { ActionButtonReturnType } from '#/shared/components/action-button.tsx'

export type DashboardChurchEventsTableMeta = {
  onDelete: (churchEventId: string) => ActionButtonReturnType
}
