import { Fragment } from 'react/jsx-runtime'
import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { AlertCircleIcon, ChevronRightIcon } from 'lucide-react'
import { latestEventsQueryOptions } from '#/features/home/queries'
import { Alert, AlertDescription, AlertTitle } from '#/shared/components/ui/alert'
import { Button } from '#/shared/components/ui/button'
import { Separator } from '#/shared/components/ui/separator'
import { Skeleton } from '#/shared/components/ui/skeleton'
import { Typography } from '#/shared/components/ui/typography'
import { formatDate } from '#/utils/date'

export function LatestEventsSection() {
  const { data: events, isPending, isError, refetch } = useQuery(latestEventsQueryOptions)

  if (isPending) return <UpcomingEventsSkeleton />
  if (isError) return <LatestEventsError onRetry={refetch} />
  if (events.length === 0) return <p>Aucun événement à venir</p>

  return (
    <div className="flex flex-col gap-3">
      {events.map((event) => {
        const startDate = event.startDate
        const day = startDate.getDate()
        const month = startDate.toLocaleDateString('fr-FR', { month: 'short' })

        return (
          <Link
            to="/event/$slug"
            params={{ slug: event.slug }}
            key={event.id}
            className="group flex items-center gap-4 rounded-xl p-3 ring-1 ring-foreground/10 transition duration-300 hover:-translate-y-0.5 hover:shadow-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            <time
              dateTime={startDate.toISOString()}
              className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-lg bg-secondary text-secondary-foreground"
            >
              <span className="text-xl leading-none font-bold">{day}</span>
              <span className="mt-0.5 text-xs tracking-wide uppercase">{month}</span>
            </time>
            <div className="min-w-0">
              <Typography
                variant="h4"
                className="truncate transition-colors group-hover:text-catholic-gold"
              >
                {event.title}
              </Typography>
              <time className="text-sm text-muted-foreground">
                {formatDate(startDate.toISOString(), { weekday: 'short' })}
              </time>
            </div>
            <ChevronRightIcon className="ml-auto size-5 shrink-0 text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-catholic-gold" />
          </Link>
        )
      })}
    </div>
  )
}

function UpcomingEventsSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: 3 }).map((_item, index) => (
        <Fragment key={index}>
          <div className="flex items-center gap-4 rounded-xl p-3 ring-1 ring-foreground/10">
            <Skeleton className="h-14 w-14 shrink-0 rounded-lg" />
            <div className="flex flex-1 flex-col gap-2">
              <Skeleton className="h-5 w-2/4" />
              <Skeleton className="h-3 w-28" />
            </div>
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
