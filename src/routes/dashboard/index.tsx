import { Suspense } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { envClient } from '#/config/env-client'
import { DashboardRecentActivity } from '#/features/dashboard/components/dashboard-recent-activity'
import { DashboardStats } from '#/features/dashboard/components/dashboard-stats'
import { Typography } from '#/shared/components/ui/typography'
import { authClient } from '#/shared/integrations/auth/auth-client'

export const Route = createFileRoute('/dashboard/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data: session } = authClient.useSession()

  return (
    <div className="container mx-auto flex flex-col gap-5">
      <div>
        <Typography variant="h1">Bienvenue, {session?.user.name} !</Typography>
        <Typography variant="p" className="text-muted-foreground">
          Vous êtes connecté au tableau de bord de l'
          <strong>{envClient.VITE_APP_TITLE}</strong>.
        </Typography>
      </div>

      <Suspense>
        <DashboardStats />
      </Suspense>

      <DashboardRecentActivity />
    </div>
  )
}
