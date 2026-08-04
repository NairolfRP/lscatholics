import { createFileRoute, Link, redirect, stripSearchParams } from '@tanstack/react-router'
import { PlusIcon } from 'lucide-react'
import { DashboardChurchEventsList } from '#/features/church-event/components/dashboard-church-events-list.tsx'
import { churchEventsDashboardQueryOptions } from '#/features/church-event/queries.ts'
import { DashboardHeading } from '#/features/dashboard/components/dashboard-heading.tsx'
import { usePermissions } from '#/shared/hooks/use-permissions'
import { hasPermission } from '#/shared/utils/permissions'
import { pageMetadata } from '#/utils/seo.ts'
import { DebouncedInput } from '#shared/components/debounced-input.tsx'
import { buttonVariants } from '#shared/components/ui/button.tsx'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#shared/components/ui/card.tsx'
import { DASHBOARD_LIST_INITIAL_FILTERS } from '#shared/constants/dashboard.ts'
import { dashboardSearchSchema } from '#shared/schemas/dashboard/search.schema.ts'
import { sortBySchema } from '#shared/schemas/pagination.schema.ts'

export const Route = createFileRoute('/dashboard/events/')({
  head: () => ({
    meta: pageMetadata('Liste des événements'),
  }),
  validateSearch: dashboardSearchSchema.extend({
    sortBy: sortBySchema.catch('startDate.asc').default('startDate.asc'),
  }),
  search: {
    middlewares: [
      stripSearchParams({ ...DASHBOARD_LIST_INITIAL_FILTERS, sortBy: 'startDate.asc' }),
    ],
  },
  beforeLoad: ({ context }) => {
    if (!hasPermission(context.gameContext.permissions, 'event', 'read')) {
      throw redirect({ to: '/dashboard', replace: true })
    }
  },
  loaderDeps: ({ search }) => search,
  loader: async ({ deps, context }) => {
    await context.queryClient.prefetchQuery(churchEventsDashboardQueryOptions(deps))
  },
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = Route.useNavigate()
  const searchParams = Route.useSearch()
  const permissions = usePermissions()
  const canCreate = hasPermission(permissions, 'event', 'create')

  const handleSearch = (value: string) => {
    const trimmed = value.trim()
    if (trimmed.toUpperCase() === searchParams.search.trim().toUpperCase()) return

    void navigate({
      search: {
        search: trimmed,
      },
      reloadDocument: false,
    })
  }

  return (
    <div className="container mx-auto pt-5">
      <div className="space-y-6">
        <DashboardHeading
          title="Liste des événements"
          description="Gérez les événements de l'archidiocèse sur l'application"
          right={
            canCreate ? (
              <Link
                to="/dashboard/events/create"
                className={buttonVariants({ variant: 'default' })}
              >
                <PlusIcon className="mr-2 h-4 w-4" />
                Nouvel événement
              </Link>
            ) : undefined
          }
        />

        <Card>
          <CardHeader>
            <CardTitle>Liste des événements</CardTitle>
            <CardDescription />
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <DebouncedInput
              type="search"
              value={searchParams.search}
              onChange={(v) => handleSearch(String(v))}
              placeholder="Rechercher..."
              aria-label="Rechercher..."
              autoComplete="off"
              debounce={500}
            />

            <DashboardChurchEventsList />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
