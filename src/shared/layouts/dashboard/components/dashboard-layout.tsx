import type { PropsWithChildren } from 'react'
import { SidebarInset, SidebarProvider } from '#/shared/components/ui/sidebar'
import { TooltipProvider } from '#/shared/components/ui/tooltip'
import { DashboardHeader } from './dashboard-header'
import { DashboardSidebar } from './dashboard-sidebar'

export function DashboardLayout({ children }: PropsWithChildren) {
  return (
    <TooltipProvider delay={0}>
      <SidebarProvider>
        <DashboardSidebar />
        <SidebarInset>
          <DashboardHeader />
          <div className="flex min-w-0 flex-1 flex-col p-4 md:p-6 lg:p-8">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}
