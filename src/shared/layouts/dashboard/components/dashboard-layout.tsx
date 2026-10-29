import type { PropsWithChildren } from 'react'
import { useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { SidebarInset, SidebarProvider } from '#/shared/components/ui/sidebar'
import { TooltipProvider } from '#/shared/components/ui/tooltip'
import { authClient } from '#/shared/integrations/auth/auth-client'
import { DashboardHeader } from './dashboard-header'
import { DashboardSidebar } from './dashboard-sidebar'

export function DashboardLayout({ children }: PropsWithChildren) {
  const { data: session, isPending } = authClient.useSession()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isPending && !session) {
      void navigate({ to: '/', replace: true })
    }
  }, [isPending, navigate, session])

  if (!isPending && !session) {
    return null
  }

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
