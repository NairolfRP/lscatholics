import type { InertiaProps } from '@/shared/types/pages'
import type { Data } from '@generated/data'
import Head from '@/shared/components/app-head'
import { Button } from '@/shared/components/ui/button'
import { Link } from '@adonisjs/inertia/react'
import { ArrowLeft, Edit, Eye } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { client, urlFor } from '@/lib/client'
import { MarkdownContent } from '@/shared/components/ui/markdown'
import { Badge } from '@/shared/components/ui/badge'
import { parishes } from '@/shared/constants/parishes.constants'
import { withDashboardLayout } from '@/shared/components/layout'

type PageProps = InertiaProps<{
  event: Data.ScheduledEvents.ScheduledEvent.Variants['allFields']
}>

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default withDashboardLayout<PageProps>(
  ({ event }) => {
    return (
      <>
        <Head title={event.title} />

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" asChild>
                <Link route="dashboard.dashboard_events.index">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">{event.title}</h1>
                <p className="text-gray-500 dark:text-gray-400">
                  {event.startDate ? formatDate(event.startDate) : 'Date inconnue'}
                  {event.endDate && `— ${formatDate(event.endDate)}`}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <Link route="event" routeParams={{ slug: event.slug }} target="_blank">
                  <Eye className="mr-2 h-4 w-4" />
                  Voir
                </Link>
              </Button>
              <Button asChild>
                <Link route="dashboard.dashboard_events.edit" routeParams={{ id: event.id }}>
                  <Edit className="mr-2 h-4 w-4" />
                  Modifier
                </Link>
              </Button>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Contenu</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {event.coverImageUrl && (
                    <div className="aspect-video w-full overflow-hidden rounded-lg">
                      <img
                        src={event.coverImageUrl}
                        alt={event.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}

                  {event.flyerUrl && (
                    <div className="aspect-video w-full overflow-hidden rounded-lg">
                      <img
                        src={event.flyerUrl}
                        alt="Flyer de l'événement"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}

                  {event.description && (
                    <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {event.description}
                      </p>
                    </div>
                  )}

                  <div className="prose prose-gray max-w-none dark:prose-invert">
                    <MarkdownContent content={event.content} />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div>
                    <p className="font-medium text-gray-500 dark:text-gray-400">URL</p>
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded dark:bg-gray-800">
                      {import.meta.env.VITE_APP_URL + client.urlFor('event', { slug: event.slug })}
                    </code>
                  </div>

                  {event.registrationRequired ? (
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary"> Inscription requise </Badge>
                      <Badge variant="outline">
                        Max participants: {event.maxParticipants || 'Illimité'}
                      </Badge>
                    </div>
                  ) : null}

                  {event.parishId ? (
                    <div>
                      <p className="font-medium text-gray-500 dark:text-gray-400">Paroisse</p>
                      <p>
                        {parishes.find((p) => p.id == event.parishId)?.name || 'Paroisse invalide'}
                      </p>
                    </div>
                  ) : null}

                  <div>
                    <p className="font-medium text-gray-500 dark:text-gray-400">
                      Date de l'événement
                    </p>
                    <p>{event.startDate ? formatDate(event.startDate) : 'Date inconnue'}</p>
                  </div>
                  {event.endDate && (
                    <div>
                      <p className="font-medium text-gray-500 dark:text-gray-400">
                        Fin de l'événement
                      </p>
                      <p>{formatDate(event.endDate)}</p>
                    </div>
                  )}

                  <div>
                    <p className="font-medium text-gray-500 dark:text-gray-400">Créé le</p>
                    <p>{event.createdAt ? formatDate(event.createdAt) : 'Date inconnue'}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-500 dark:text-gray-400">Modifié le</p>
                    <p>{event.updatedAt ? formatDate(event.updatedAt) : 'Jamais'}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </>
    )
  },
  {
    breadcrumb: (props) => [
      { label: 'Événements', href: urlFor('dashboard.dashboard_events.index') },
      { label: props.event.title },
    ],
  }
)
