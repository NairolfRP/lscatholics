import type { PropsWithChildren } from 'react'
import { SidebarInset, SidebarProvider } from '#/shared/components/ui/sidebar'
import { TooltipProvider } from '#/shared/components/ui/tooltip'
import { DashboardHeader } from './dashboard-header'
import { DashboardSidebar } from './dashboard-sidebar'

export function DashboardLayout({ children }: PropsWithChildren) {
  return (
    <TooltipProvider>
      <SidebarProvider>
        <DashboardSidebar />
        <SidebarInset>
          <DashboardHeader />
          <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}
