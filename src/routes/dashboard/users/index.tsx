import { createFileRoute, stripSearchParams } from '@tanstack/react-router'
import { DashboardHeading } from '#/features/dashboard/components/dashboard-heading'
import { DASHBOARD_LIST_INITIAL_FILTERS } from '#/features/dashboard/constants/dashboard.constants.ts'
import { dashboardSearchSchema } from '#/features/dashboard/schemas/dashboard-search.schema'
import { UsersList } from '#/features/user/components/admin/users-list.tsx'
import { CreateFakeUserButton } from '#/features/user/components/create-fake-user-button'
import { DebouncedInput } from '#/shared/components/debounced-input'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#/shared/components/ui/card'
import { pageMetadata } from '#/utils/seo'

export const Route = createFileRoute('/dashboard/users/')({
  head: () => ({
    meta: pageMetadata('Liste des utilisateurs'),
  }),
  validateSearch: dashboardSearchSchema,
  search: {
    middlewares: [stripSearchParams(DASHBOARD_LIST_INITIAL_FILTERS)],
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
          title="Utilisateurs"
          description="Page OOC. Gérer les utilisateurs de l'application."
          right={import.meta.env.DEV ? <CreateFakeUserButton deps={searchParams} /> : undefined}
        />

        <Card>
          <CardHeader>
            <CardTitle>Liste des utilisateurs</CardTitle>
            <CardDescription />
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <DebouncedInput
              type="search"
              value={searchParams.search}
              onChange={(v) => handleSearch(String(v))}
              placeholder="Rechercher par nom d'utilisateur..."
              aria-label="Rechercher par nom d'utilisateur"
              autoComplete="off"
            />

            <UsersList />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
