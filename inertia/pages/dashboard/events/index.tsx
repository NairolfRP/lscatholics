import { InertiaProps } from '@/shared/types/pages'
import type { Data } from '@generated/data'
import { urlFor } from '@/lib/client'
import { router } from '@inertiajs/react'
import Head from '@/shared/components/app-head'
import { Link } from '@adonisjs/inertia/react'
import { CalendarIcon, Edit, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card'
import { Typography } from '@/shared/components/ui/typography'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table'
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
import { useCallback } from 'react'
import { ActionButton } from '@/shared/components/action-button'
import { withDashboardLayout } from '@/shared/components/layout'

type PageProps = InertiaProps<{
  events: {
    data: Data.ScheduledEvents.ScheduledEvent[]
    metadata: {
      total: number
      perPage: number
      currentPage: number
      lastPage: number
      firstPage: number
    }
  }
}>

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default withDashboardLayout<PageProps>(
  ({ events }) => {
    const handleChangePage = useDebouncedCallback((newPage: number) => {
      router.get(
        urlFor('dashboard.dashboard_events.index'),
        { page: !newPage || newPage <= 1 ? undefined : newPage },
        {
          preserveState: true,
          preserveScroll: true,
        }
      )
    }, 300)

    const deleteEvent = useCallback((id: number) => {
      router.delete(urlFor('dashboard.dashboard_events.destroy', { id }))
    }, [])

    return (
      <>
        <Head title="Événements" />

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Événements</h1>
              <p className="text-gray-500 dark:text-gray-400">
                Gérez les événements de votre communauté
              </p>
            </div>
            <Button asChild>
              <Link route="dashboard.dashboard_events.create">
                <Plus className="mr-2 h-4 w-4" />
                Nouvel événement
              </Link>
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Liste des événements</CardTitle>
              <CardDescription> {events.metadata.total} événement(s) au total </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {events.data.length > 0 ? (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Événement</TableHead>
                        <TableHead>Lieu</TableHead>
                        <TableHead>Date de début</TableHead>
                        <TableHead>Max participants</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {events.data.map((event) => (
                        <TableRow key={event.id}>
                          <TableCell className="font-medium">
                            <Link
                              route="dashboard.dashboard_events.show"
                              routeParams={{ id: event.id }}
                              className="hover:underline"
                            >
                              {event.title}
                            </Link>
                          </TableCell>
                          <TableCell>{event.location || 'Non spécifié'}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <CalendarIcon className="h-4 w-4 text-gray-400" />
                              {event.startDate ? formatDate(event.startDate) : 'Date inconnue'}
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm">
                              {event.maxParticipants ? event.maxParticipants : 'Illimité'}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="icon" asChild>
                                <Link
                                  route="dashboard.dashboard_events.edit"
                                  routeParams={{ id: event.id }}
                                >
                                  <Edit className="h-4 w-4" />
                                </Link>
                              </Button>
                              <ActionButton
                                variant="ghost"
                                size="icon"
                                areYouSureTitle="Êtes-vous sûr de vouloir supprimer cet événement ?"
                                action={deleteEvent.bind(null, event.id)}
                                requireAreYouSure
                              >
                                <Trash2 className="h-4 w-4 text-red-600" />
                              </ActionButton>
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
                          onClick={() => handleChangePage(events.metadata.currentPage - 1)}
                          aria-disabled={events.metadata.currentPage <= events.metadata.firstPage}
                          className={
                            events.metadata.currentPage <= events.metadata.firstPage
                              ? 'pointer-events-none opacity-50'
                              : 'cursor-pointer'
                          }
                        />
                      </PaginationItem>

                      {getPaginationItems(
                        events.metadata.currentPage,
                        events.metadata.lastPage
                      ).map((item, index) =>
                        item === 'ellipsis' ? (
                          <PaginationItem key={`ellipsis-${index}`}>
                            <PaginationEllipsis />
                          </PaginationItem>
                        ) : (
                          <PaginationItem key={item}>
                            <PaginationLink
                              isActive={item === events.metadata.currentPage}
                              onClick={() => handleChangePage(item)}
                              className={
                                item === events.metadata.currentPage
                                  ? 'pointer-events-none opacity-50'
                                  : 'cursor-pointer'
                              }
                              aria-disabled={item === events.metadata.currentPage}
                            >
                              {item}
                            </PaginationLink>
                          </PaginationItem>
                        )
                      )}

                      <PaginationItem>
                        <PaginationNext
                          onClick={() => handleChangePage(events.metadata.currentPage + 1)}
                          aria-disabled={events.metadata.currentPage >= events.metadata.lastPage}
                          className={
                            events.metadata.currentPage >= events.metadata.lastPage
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
  },
  {
    breadcrumb: [{ label: 'Événements' }],
  }
)
