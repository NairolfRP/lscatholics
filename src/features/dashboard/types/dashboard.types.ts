import type { LucideIcon } from 'lucide-react'
import type { RoutePath } from '#/shared/types/route.types'

export type DashboardMenuCategory = {
  id: string
  label: string
  icon: LucideIcon
}

export type DashboardMenuItem = {
  label: string
  to: RoutePath
  icon?: LucideIcon
  permissions: Record<string, string[]>
  category?: DashboardMenuCategory
}
