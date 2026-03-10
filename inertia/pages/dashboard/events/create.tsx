import Head from '@/shared/components/app-head'
import { Button } from '@/shared/components/ui/button'
import type { InertiaProps } from '@/types'
import { Link } from '@adonisjs/inertia/react'
import { ArrowLeft } from 'lucide-react'
import { CreateEventForm } from '@/features/scheduled-events/components/form/dashboard/create-event-form'

type PageProps = InertiaProps

export default function DashboardCreateEventForm({}: PageProps) {
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
            <h1 className="text-3xl font-bold tracking-tight">Créer un événement</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Annoncez un nouvel événement à la communauté
            </p>
          </div>
        </div>

        <CreateEventForm />
      </div>
    </>
  )
}
