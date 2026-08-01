import { Fragment } from 'react/jsx-runtime'
import { useSuspenseQuery } from '@tanstack/react-query'
import { Link, useSearch } from '@tanstack/react-router'
import { addDays, endOfDay, endOfMonth, isBefore, max, min, startOfDay } from 'date-fns'
import { AlertCircleIcon, ArrowRightIcon } from 'lucide-react'
import {
  ChurchEventsMonthNavigation,
} from '#/features/church-event/components/church-events-month-navigation.tsx'
import type { ChurchEvent } from '#/features/church-event/types/church-event.types.ts'
import { formatDate, formatDateTime } from '#/utils/date.ts'
import { Alert, AlertAction, AlertDescription, AlertTitle } from '#shared/components/ui/alert.tsx'
import { Button } from '#shared/components/ui/button.tsx'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '#shared/components/ui/card.tsx'
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
        <div className="mx-auto max-w-2xl text-center italic">
          <Alert className="text-center">
            <AlertTitle>Aucun événement trouvé</AlertTitle>
          </Alert>
        </div>
      </div>
    )
  }

  const eventsByDay = groupEventsByDay(churchEvents, search)

  return (
    <div className="space-y-10">
      <ChurchEventsMonthNavigation />
      {Object.entries(eventsByDay).map(([day, items]) => {
        return (
          <Fragment key={day}>
            <Typography variant="h3" className="mb-5 border-b-2 border-b-primary">
              {day}
            </Typography>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <Link
                  key={item.slug}
                  to="/event/$slug"
                  params={{ slug: item.slug }}
                  className="group"
                >
                  <Card className="relative mx-auto flex h-full w-full flex-col pt-0">
                    <img
                      src={item.coverImageUrl}
                      alt="Event cover"
                      className="relative z-20 aspect-video w-full object-cover"
                    />
                    <CardHeader>
                      <CardTitle className="text-xl font-bold transition-colors group-hover:text-primary">
                        {item.title}
                      </CardTitle>
                      <CardDescription className="font-medium text-primary">
                        {formatDateTime(item.startDate)}
                        {item.endDate ? ` - ${formatDateTime(item.endDate)}` : null}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>{item.description}</CardContent>
                    <CardFooter className="mt-auto justify-start px-6">
                      <Button
                        variant="link"
                        className="p-0 font-bold text-primary uppercase hover:bg-transparent"
                      >
                        En savoir plus <ArrowRightIcon />
                      </Button>
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </div>
          </Fragment>
        )
      })}
      <ChurchEventsMonthNavigation />
    </div>
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
