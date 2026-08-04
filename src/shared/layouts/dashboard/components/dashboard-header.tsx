import { useRouterState } from '@tanstack/react-router'
import { dashboardMenuItems } from '#/features/dashboard/constants/dashboard-menu-items'
import { ThemeModeToggle } from '#/shared/components/theme-mode-toggle'
import { Separator } from '#/shared/components/ui/separator'
import { SidebarTrigger } from '#/shared/components/ui/sidebar'

export function DashboardHeader() {
  const pathname = useRouterState({ select: (state) => state.location.pathname })

  const normalized = pathname.replace(/\/+$/, '')
  const exact = dashboardMenuItems.find((item) => item.to === normalized)
  const sectionLabel =
    exact?.label ??
    dashboardMenuItems
      .filter((item) => item.to !== '/dashboard')
      .sort((a, b) => b.to.length - a.to.length)
      .find((item) => normalized.startsWith(item.to))?.label

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-2 border-b bg-background/95 px-4 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 md:px-6">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
      <p className="truncate text-sm font-semibold">{sectionLabel}</p>
      <div className="ml-auto flex items-center gap-2">
        <ThemeModeToggle />
      </div>
    </header>
  )
}
