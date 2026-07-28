import type { LucideIcon } from 'lucide-react'
import type { RoutePath } from '#/shared/types/route.types'

export type DashboardMenuItem = {
  label: string
  to: RoutePath
  icon: LucideIcon
  permissions: Record<string, string[]>
}
