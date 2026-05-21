import Head from '@/shared/components/app-head'
import { Button } from '@/shared/components/ui/button'
import type { InertiaProps } from '@/shared/types/pages'
import { Link } from '@adonisjs/inertia/react'
import { ArrowLeft } from 'lucide-react'
import type { Data } from '@generated/data'
import { EditEventForm } from '@/features/scheduled-events/components/form/dashboard/edit-event-form'
import { withDashboardLayout } from '@/shared/components/layout'
import { urlFor } from '@/lib/client'

type PageProps = InertiaProps<{
  event: Data.ScheduledEvents.ScheduledEvent.Variants['allFields']
}>

export default withDashboardLayout<PageProps>(
  ({ event }) => {
    return (
      <>
        <Head title="Créer un événement" />

        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Retour sur la page d'administration des événements"
              asChild
            >
              <Link route="dashboard.dashboard_events.index">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Modifier l'événement</h1>
              <p className="text-gray-500 dark:text-gray-400">{event.title}</p>
            </div>
          </div>

          <EditEventForm event={event} />
        </div>
      </>
    )
  },
  {
    breadcrumb: (props) => [
      { label: 'Événements', href: urlFor('dashboard.dashboard_events.index') },
      { label: `Modifier « ${props.event.title} »` },
    ],
  }
)
