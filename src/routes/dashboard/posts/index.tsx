import { createFileRoute, Link, stripSearchParams } from '@tanstack/react-router'
import { PlusIcon } from 'lucide-react'
import { DashboardHeading } from '#/features/dashboard/components/dashboard-heading.tsx'
import { DASHBOARD_LIST_INITIAL_FILTERS } from '#/features/dashboard/constants/dashboard.constants.ts'
import { dashboardSearchSchema } from '#/features/dashboard/schemas/dashboard-search.schema.ts'
import { DashboardPostsList } from '#/features/post/components/dashboard-posts-list.tsx'
import { postsDashboardQueryOptions } from '#/features/post/queries.ts'
import { DebouncedInput } from '#/shared/components/debounced-input.tsx'
import { buttonVariants } from '#/shared/components/ui/button.tsx'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#/shared/components/ui/card.tsx'
import { pageMetadata } from '#/utils/seo.ts'

export const Route = createFileRoute('/dashboard/posts/')({
  head: () => ({
    meta: pageMetadata('Liste des articles'),
  }),
  validateSearch: dashboardSearchSchema,
  search: {
    middlewares: [stripSearchParams(DASHBOARD_LIST_INITIAL_FILTERS)],
  },
  loaderDeps: ({ search }) => search,
  loader: async ({ deps, context }) => {
    await context.queryClient.prefetchQuery(postsDashboardQueryOptions(deps))
  },
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = Route.useNavigate()
  const searchParams = Route.useSearch()

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
          title="Articles"
          description="Gérez les articles sur le site"
          right={
            <Link to="/dashboard/posts/create" className={buttonVariants({ variant: 'default' })}>
              <PlusIcon className="mr-2 h-4 w-4" />
              Nouvel article
            </Link>
          }
        />

        <Card>
          <CardHeader>
            <CardTitle>Liste des articles</CardTitle>
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

            <DashboardPostsList />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
