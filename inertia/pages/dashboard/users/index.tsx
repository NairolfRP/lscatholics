import { InertiaProps } from '@/types'
import type { Data } from '@generated/data'
import { urlFor } from '@/client'
import { router } from '@inertiajs/react'
import Head from '@/shared/components/app-head'
import { Link } from '@adonisjs/inertia/react'
import { Edit, Trash2 } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card'
import { Input } from '@/shared/components/ui/input'
import { Typography } from '@/shared/components/ui/typography'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table'
import { Badge } from '@/shared/components/ui/badge'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/shared/components/ui/pagination'
import { getPaginationItems } from '@/lib/utils'
import { useDebouncedCallback } from 'use-debounce'
import { usePageProps } from '@/shared/hooks/use_page_props'
import { ActionButton } from '@/shared/components/action-button'

type PageProps = InertiaProps<{
  users: {
    data: Data.Users.User.Variants['withRoles'][]
    metadata: {
      total: number
      perPage: number
      currentPage: number
      lastPage: number
      firstPage: number
    }
  }
  filters: { search: string }
}>

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default function DashboardUsersPage({ user, users, filters }: PageProps) {
  const page = usePageProps<{ permissions: string[] }>()
  const permissions = page.permissions

  const handleSearch = useDebouncedCallback((v: string) => {
    router.get(
      urlFor('dashboard.dashboard_users.index'),
      { search: v || undefined },
      {
        preserveState: true,
        preserveScroll: true,
        replace: true,
      }
    )
  }, 300)

  const handleChangePage = useDebouncedCallback((newPage: number) => {
    router.get(
      urlFor('dashboard.dashboard_users.index'),
      { search: filters.search || undefined, page: !newPage || newPage <= 1 ? undefined : newPage },
      {
        preserveState: true,
        preserveScroll: true,
      }
    )
  }, 300)

  const deleteUser = async (id: number) => {
    if (user?.id === id || !permissions.includes('deleteUsers')) {
      return { error: true, message: "Vous n'êtes pas autorisé à faire cela." }
    }

    router.delete(urlFor('dashboard.dashboard_users.destroy', { id }))

    return { error: false }
  }

  return (
    <>
      <Head title="Liste des utilisateurs" />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Utilisateurs</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Page OOC. Gérez les utilisateurs du site.
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Liste des utilisateurs</CardTitle>
            <CardDescription> {users.metadata.total} utilisateur(s) au total </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Input
              defaultValue={filters.search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Rechercher par nom d'utilisateur..."
            />
            {users.data.length > 0 ? (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nom d'utilisateur GTAW</TableHead>
                      <TableHead>Rôle(s)</TableHead>
                      <TableHead>Créé le</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.data.map((itemUser) => (
                      <TableRow key={itemUser.id}>
                        <TableCell className="font-medium">
                          <Link
                            route="dashboard.dashboard_users.edit"
                            routeParams={{ id: itemUser.id }}
                            className="hover:underline"
                          >
                            {itemUser.name}
                          </Link>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-2">
                            <div className="flex flex-wrap gap-2">
                              {itemUser.roles.map((role) => (
                                <Badge key={role.slug}>{role.name}</Badge>
                              ))}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {itemUser.createdAt ? formatDate(itemUser.createdAt) : ''}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" asChild>
                              <Link
                                route="dashboard.dashboard_users.edit"
                                routeParams={{ id: itemUser.id }}
                              >
                                <Edit className="h-4 w-4" />
                              </Link>
                            </Button>
                            {user?.id !== itemUser.id && permissions.includes('deleteUsers') ? (
                              <ActionButton
                                variant="ghost"
                                size="icon"
                                areYouSureTitle={`Êtes-vous sûr de vouloir supprimer l'utilisateur « ${itemUser.name} » ?`}
                                areYouSureDescription="Attention. La suppression est définitive, immédiate et sensible. Assurez-vous d'avoir de bonnes raisons."
                                action={deleteUser.bind(null, itemUser.id)}
                                requireAreYouSure
                              >
                                <Trash2 className="h-4 w-4 text-red-600" />
                              </ActionButton>
                            ) : null}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => handleChangePage(users.metadata.currentPage - 1)}
                        aria-disabled={users.metadata.currentPage <= users.metadata.firstPage}
                        className={
                          users.metadata.currentPage <= users.metadata.firstPage
                            ? 'pointer-events-none opacity-50'
                            : 'cursor-pointer'
                        }
                      />
                    </PaginationItem>

                    {getPaginationItems(users.metadata.currentPage, users.metadata.lastPage).map(
                      (item, index) =>
                        item === 'ellipsis' ? (
                          <PaginationItem key={`ellipsis-${index}`}>
                            <PaginationEllipsis />
                          </PaginationItem>
                        ) : (
                          <PaginationItem key={item}>
                            <PaginationLink
                              isActive={item === users.metadata.currentPage}
                              onClick={() => handleChangePage(item)}
                              className={
                                item === users.metadata.currentPage
                                  ? 'pointer-events-none opacity-50'
                                  : 'cursor-pointer'
                              }
                              aria-disabled={item === users.metadata.currentPage}
                            >
                              {item}
                            </PaginationLink>
                          </PaginationItem>
                        )
                    )}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() => handleChangePage(users.metadata.currentPage + 1)}
                        aria-disabled={users.metadata.currentPage >= users.metadata.lastPage}
                        className={
                          users.metadata.currentPage >= users.metadata.lastPage
                            ? 'pointer-events-none opacity-50'
                            : 'cursor-pointer'
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </>
            ) : (
              <Typography variant="small" className="mt-5">
                Aucun résultat
              </Typography>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
}
