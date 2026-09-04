import { createFileRoute, useRouteContext } from '@tanstack/react-router'
import { envClient } from '#/config/env-client'
import { DashboardHeading } from '#/features/dashboard/components/dashboard-heading'
import { DashboardQuickLinks } from '#/features/dashboard/components/dashboard-quick-links'
import { DashboardRecentActivity } from '#/features/dashboard/components/dashboard-recent-activity'
import { Typography } from '#/shared/components/ui/typography'
import { pageMetadata } from '#/utils/seo'

export const Route = createFileRoute('/dashboard/')({
  head: () => ({
    meta: pageMetadata('Tableau de bord'),
  }),
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
    <div className="container mx-auto space-y-6 pt-5">
      <DashboardHeading
        title={`Bienvenue, ${displayName} !`}
        description={
          <Typography variant="p" className="text-muted-foreground">
            Vous êtes connecté au tableau de bord de l'<strong>{envClient.VITE_APP_TITLE}</strong>.
          </Typography>
        }
      />

      <DashboardQuickLinks />

      <DashboardRecentActivity />
    </div>
  )
}
