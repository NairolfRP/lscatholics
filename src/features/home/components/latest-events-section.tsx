import { Fragment } from 'react/jsx-runtime'
import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { AlertCircleIcon } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '#/shared/components/ui/alert'
import { Button } from '#/shared/components/ui/button'
import { Separator } from '#/shared/components/ui/separator'
import { Skeleton } from '#/shared/components/ui/skeleton'
import { Typography } from '#/shared/components/ui/typography'
import { formatDate } from '#/utils/date'
import { latestEventsQueryOptions } from '#shared/queries/church-event.queries.ts'

export function LatestEventsSection() {
  const { data: events, isPending, isError, refetch } = useQuery(latestEventsQueryOptions)

  if (isPending) return <UpcomingEventsSkeleton />
  if (isError) return <LatestEventsError onRetry={refetch} />
  if (events.length === 0) return <p>Aucun événement à venir</p>

  return (
    <div className="flex flex-col gap-8">
      {events.map((event, index) => (
        <Link
          to="/event/$slug"
          params={{ slug: event.slug }}
          className="hover:text-primary"
          key={event.id}
        >
          <time className="text-sm text-muted-foreground">
            {formatDate(event.startDate.toISOString())}
          </time>
          <Typography variant="h4">{event.title}</Typography>
          {index + 1 < events.length && <Separator className="mt-4" />}
        </Link>
      ))}
    </div>
  )
}

function UpcomingEventsSkeleton() {
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

function LatestEventsError({ onRetry }: { onRetry: () => void }) {
  return (
    <Alert variant="destructive" className="flex w-full flex-col gap-2">
      <div className="flex items-center gap-2">
        <AlertCircleIcon />
        <AlertTitle>Échec du chargement</AlertTitle>
      </div>
      <AlertDescription>
        Le chargement des prochains événements a échoué. Cela peut être dû à une erreur réseau ou à
        un problème interne.
      </AlertDescription>
      <Button variant="outline" onClick={onRetry}>
        Réessayer
      </Button>
    </Alert>
  )
}
