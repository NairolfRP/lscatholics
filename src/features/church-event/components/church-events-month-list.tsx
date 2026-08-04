import { useSuspenseQuery } from '@tanstack/react-query'
import { Link, useNavigate, useSearch } from '@tanstack/react-router'
import { Image } from '@unpic/react'
import { addDays, endOfDay, endOfMonth, isBefore, max, min, startOfDay } from 'date-fns'
import { AlertCircleIcon, ArrowRightIcon, CalendarDaysIcon, CalendarX2Icon } from 'lucide-react'
import {
  ChurchEventsMonthNavigation,
  ChurchEventsMonthNavigationSkeleton,
} from '#/features/church-event/components/church-events-month-navigation.tsx'
import type { ChurchEvent } from '#/features/church-event/types/church-event.types.ts'
import { formatDate, formatDateTime } from '#/utils/date.ts'
import { Alert, AlertAction, AlertDescription, AlertTitle } from '#shared/components/ui/alert.tsx'
import { Badge } from '#shared/components/ui/badge.tsx'
import { Button } from '#shared/components/ui/button.tsx'
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '#shared/components/ui/card.tsx'
import { Skeleton } from '#shared/components/ui/skeleton.tsx'
import { Typography } from '#shared/components/ui/typography.tsx'
import { churchEventsQueryOptions } from '#/features/church-event/queries.ts'

export function ChurchEventsMonthList() {
  const search = useSearch({ from: '/_app/events' })

  const { data: churchEvents, error, refetch } = useSuspenseQuery(churchEventsQueryOptions(search))

  if (error) {
    return (
      <Alert variant="destructive" className="mx-auto max-w-2xl">
        <AlertCircleIcon />
        <AlertTitle>Service temporairement indisponible</AlertTitle>
        <AlertDescription>
          Impossible de charger les événements. Réessayez dans quelques instants.
        </AlertDescription>
        <AlertAction>
          <Button size="xs" variant="default" onClick={() => refetch()}>
            Réessayer
          </Button>
        </AlertAction>
      </Alert>
    )
  }

  if (!churchEvents || churchEvents.length === 0) {
    return (
      <div className="space-y-10">
        <ChurchEventsMonthNavigation />
        <ChurchEventsMonthListEmpty />
      </div>
    )
  }

  const eventsByDay = groupEventsByDay(churchEvents, search)

  return (
    <div className="space-y-10">
      <ChurchEventsMonthNavigation />
      {Object.entries(eventsByDay).map(([day, items]) => {
        return (
          <div key={day} className="space-y-8">
            <Typography
              variant="h3"
              className="flex flex-wrap items-center gap-x-3 gap-y-1 pb-2 text-2xl text-primary"
            >
              {day}
              <Badge variant="secondary" className="rounded-full px-2.5">
                {items.length} {items.length > 1 ? 'événements' : 'événement'}
              </Badge>
            </Typography>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {items.map((item) => (
                <ChurchEventCard key={item.slug} event={item} />
              ))}
            </div>
          </div>
        )
      })}
      <ChurchEventsMonthNavigation />
    </div>
  )
}

function ChurchEventCard({ event }: { event: ChurchEvent }) {
  const formattedDate = formatDateTime(event.startDate)
  const formattedEndDate = event.endDate ? formatDateTime(event.endDate) : null

  return (
    <Link
      to="/event/$slug"
      params={{ slug: event.slug }}
      className="group block h-full rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <Card className="h-full pt-0 shadow-xs transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg">
        <div className="overflow-hidden">
          <Image
            src={event.coverImageUrl}
            alt={`Image de couverture - Événement "${event.title}"`}
            loading="lazy"
            layout="fullWidth"
            className="aspect-video w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <CardHeader className="gap-3">
          <time
            dateTime={event.startDate.toISOString()}
            className="flex flex-wrap items-center gap-1.5 text-sm font-medium text-primary"
          >
            <CalendarDaysIcon className="size-4 shrink-0" />
            {formattedDate}
            {formattedEndDate ? ` - ${formattedEndDate}` : null}
          </time>
          <CardTitle className="text-xl leading-snug font-bold transition-colors group-hover:text-primary">
            {event.title}
          </CardTitle>
          <CardDescription className="line-clamp-3 text-sm/relaxed">
            {event.description}
          </CardDescription>
        </CardHeader>
        <CardFooter className="mt-auto px-6">
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
            En savoir plus
            <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" />
          </span>
        </CardFooter>
      </Card>
    </Link>
  )
}

function ChurchEventsMonthListEmpty() {
  const navigate = useNavigate({ from: '/events' })
  const now = new Date()

  return (
    <div className="flex flex-col items-center gap-5 rounded-2xl border border-dashed py-16 text-center">
      <div className="flex size-14 items-center justify-center rounded-full bg-muted">
        <CalendarX2Icon className="size-7 text-muted-foreground" />
      </div>
      <div>
        <h3 className="text-lg font-semibold">Aucun événement prévu</h3>
        <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
          Aucun événement n'est programmé ce mois-ci. Consultez les prochains événements à venir ou
          parcourez les mois voisins.
        </p>
      </div>
      <Button
        onClick={() => navigate({ search: { year: now.getFullYear(), month: now.getMonth() + 1 } })}
      >
        <CalendarDaysIcon /> Voir le mois en cours
      </Button>
    </div>
  )
}

export function ChurchEventsMonthListSkeleton() {
  return (
    <div className="space-y-10">
      <ChurchEventsMonthNavigationSkeleton />
      <div className="space-y-8">
        <Skeleton className="h-8 w-56" />
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <ChurchEventCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  )
}

function ChurchEventCardSkeleton() {
  return (
    <Card className="pt-0">
      <Skeleton className="aspect-video w-full rounded-none" />
      <CardHeader className="gap-3">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
      </CardHeader>
      <CardFooter>
        <Skeleton className="h-4 w-28" />
      </CardFooter>
    </Card>
  )
}

function groupEventsByDay(events: ChurchEvent[], yearMonth: { year: number; month: number }) {
  const monthDate = new Date(yearMonth.year, yearMonth.month - 1, 1)

  const monthStart = startOfDay(monthDate)
  const monthEnd = endOfMonth(monthDate)

  const byDay: Record<string, ChurchEvent[]> = {}

  for (const event of events) {
    const eventStart = max([startOfDay(new Date(event.startDate)), monthStart])

    const eventEnd = min([
      endOfDay(event.endDate ? new Date(event.endDate) : new Date(event.startDate)),
      monthEnd,
    ])

    let current = eventStart

    while (!isBefore(eventEnd, current)) {
      const formattedDate = formatDate(current, { weekday: 'long' })
      const key = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1)

      byDay[key] ??= []
      byDay[key].push(event)

      current = addDays(current, 1)
    }
  }

  return byDay
}
