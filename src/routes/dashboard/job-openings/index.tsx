import { createFileRoute, Link, redirect, stripSearchParams } from '@tanstack/react-router'
import { PlusIcon } from 'lucide-react'
import { DashboardHeading } from '#/features/dashboard/components/dashboard-heading.tsx'
import { DashboardJobPostingsList } from '#/features/job-posting/components/dashboard-job-postings-list.tsx'
import { jobPostingsDashboardQueryOptions } from '#/features/job-posting/queries.ts'
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

export const Route = createFileRoute('/dashboard/job-openings/')({
  head: () => ({
    meta: pageMetadata("Liste des offres d'emplois"),
  }),
  validateSearch: dashboardSearchSchema,
  search: {
    middlewares: [stripSearchParams(DASHBOARD_LIST_INITIAL_FILTERS)],
  },
  beforeLoad: ({ context }) => {
    if (!hasPermission(context.gameContext.permissions, 'job', 'read')) {
      throw redirect({ to: '/dashboard', replace: true })
    }
  },
  loaderDeps: ({ search }) => search,
  loader: async ({ deps, context }) => {
    await context.queryClient.prefetchQuery(jobPostingsDashboardQueryOptions(deps))
  },
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = Route.useNavigate()
  const searchParams = Route.useSearch()
  const permissions = usePermissions()
  const canCreate = hasPermission(permissions, 'job', 'create')

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
          title="Offres d'emplois"
          description="Gérez les offres d'emplois sur l'application"
          right={
            canCreate ? (
              <Link
                to="/dashboard/job-openings/create"
                className={buttonVariants({ variant: 'default' })}
              >
                <PlusIcon className="mr-2 h-4 w-4" />
                Ajouter une offre
              </Link>
            ) : undefined
          }
        />

        <Card>
          <CardHeader>
            <CardTitle>Liste des offres d'emplois</CardTitle>
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

            <DashboardJobPostingsList />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
