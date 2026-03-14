import Head from '@/shared/components/app-head'
import { Button } from '@/shared/components/ui/button'
import type { InertiaProps } from '@/types'
import { Link } from '@adonisjs/inertia/react'
import { ArrowLeft } from 'lucide-react'
import type { Data } from '@generated/data'
import { EditEventForm } from '@/features/scheduled-events/components/form/dashboard/edit-event-form'

type PageProps = InertiaProps<{
  event: Data.ScheduledEvents.ScheduledEvent.Variants['allFields']
}>

export default function DashboardEditEventForm({ event }: PageProps) {
  return (
    <>
      <Head title="Créer un événement" />

      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
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
}
