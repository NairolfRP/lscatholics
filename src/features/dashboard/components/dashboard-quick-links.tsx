import { Link, useRouteContext } from '@tanstack/react-router'
import { ChevronRightIcon } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#/shared/components/ui/card'
import { hasPermission } from '#/shared/utils/permissions'
import { dashboardMenuItems } from '../constants/dashboard-menu-items'

const quickLinkDescriptions: Partial<Record<string, string>> = {
  '/dashboard/posts': 'Gérez les articles publiés sur le site',
  '/dashboard/events': 'Créez et gérez les événements à venir',
  '/dashboard/job-openings': "Publiez et gérez les offres d'emploi",
  '/dashboard/users': 'Consultez la liste des utilisateurs inscrits',
}

export function DashboardQuickLinks() {
  const { gameContext } = useRouteContext({ from: '/dashboard' })
  const { permissions } = gameContext

  const items = dashboardMenuItems.filter(
    (item) =>
      item.to !== '/dashboard' &&
      Object.entries(item.permissions).every(([resource, actions]) =>
        actions.every((action) => hasPermission(permissions, resource, action))
      )
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Accès rapide</CardTitle>
        <CardDescription>Naviguez vers les sections du tableau de bord</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3 md:grid-cols-2">
        {items.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            preload={false}
            className="group flex items-center justify-between gap-3 rounded-lg border p-4 transition-colors hover:bg-accent/50"
          >
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-muted">
                <item.icon className="size-5" />
              </div>
              <div className="min-w-0">
                <p className="truncate font-medium">{item.label}</p>
                {quickLinkDescriptions[item.to] && (
                  <p className="truncate text-sm text-muted-foreground">
                    {quickLinkDescriptions[item.to]}
                  </p>
                )}
              </div>
            </div>
            <ChevronRightIcon className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1" />
          </Link>
        ))}
      </CardContent>
    </Card>
  )
}
