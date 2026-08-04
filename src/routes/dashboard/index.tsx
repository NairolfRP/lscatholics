import { Suspense } from 'react'
import { createFileRoute, useRouteContext } from '@tanstack/react-router'
import { envClient } from '#/config/env-client'
import { DashboardRecentActivity } from '#/features/dashboard/components/dashboard-recent-activity'
import { DashboardStats } from '#/features/dashboard/components/dashboard-stats'
import { Typography } from '#/shared/components/ui/typography'

export const Route = createFileRoute('/dashboard/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { gameContext } = useRouteContext({ from: '/dashboard' })

  const displayName = gameContext.currentCharacter
    ? [
        gameContext.currentCharacter.faction?.rankName,
        gameContext.currentCharacter.firstname,
        gameContext.currentCharacter.lastname,
      ]
        .filter(Boolean)
        .join(' ')
    : gameContext.user.name

  return (
    <div className="container mx-auto flex flex-col gap-5">
      <div>
        <Typography variant="h1">Bienvenue, {displayName} !</Typography>
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
