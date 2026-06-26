import { AlertCircleIcon } from 'lucide-react'
import { Fragment } from 'react/jsx-runtime'
import { Alert, AlertDescription, AlertTitle } from '@/shared/components/ui/alert'
import { Separator } from '@/shared/components/ui/separator'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { Link } from '@adonisjs/inertia/react'
import { formatDate } from '@/lib/utils'
import type { Data } from '@generated/data'

type Props = {
  upcomingEvents: Data.ScheduledEvents.ScheduledEvent.Variants['home'][]
  error?: string
}

export function HomeUpcomingEvents({ upcomingEvents, error }: Props) {
  if ((!upcomingEvents && !Array.isArray(upcomingEvents)) || error) {
    return <UpcomingEventsError message={error} />
  }

  if (upcomingEvents.length === 0) {
    return <div className="italic text-center">Aucun événement à venir !</div>
  }

  return (
    <div className="flex flex-col gap-8">
      {upcomingEvents.map((event, index) => (
        <Link
          route="event"
          routeParams={{ slug: event.slug }}
          className="hover:text-primary"
          key={event.slug}
        >
          <time className="text-sm text-muted-foreground">
            {event.startDate ? formatDate(event.startDate) : null}
          </time>
          <h4>{event.title}</h4>
          {index + 1 < upcomingEvents.length && <Separator className="mt-4" />}
        </Link>
      ))}
    </div>
  )
}

export function UpcomingEventsSkeleton() {
  return (
    <div className="flex flex-col gap-8">
      {Array.from({ length: 3 }).map((_item, index) => (
        <Fragment key={index}>
          <div className="space-y-3">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-5 w-2/4" />
          </div>
          {index >= 0 && index < 2 ? <Separator /> : null}
        </Fragment>
      ))}
    </div>
  )
}

function UpcomingEventsError({
  message = 'Le chargement des prochains événements a échoué. Cela peut être dû à une erreur réseau ou à un problème interne.',
}: {
  message?: string
}) {
  return (
    <Alert variant="destructive" className="flex w-full flex-col gap-2">
      <div className="flex items-center gap-2">
        <AlertCircleIcon />
        <AlertTitle>Échec du chargement</AlertTitle>
      </div>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  )
}
