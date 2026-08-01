import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { ChevronRight } from 'lucide-react'
import { latestEventsQueryOptions } from '#/features/home/queries.ts'
import { Button } from '#/shared/components/ui/button'
import { Skeleton } from '#/shared/components/ui/skeleton'
import { formatDate } from '#/utils/date'

export function NextChurchEvent() {
  const { data: events, isPending, isError } = useQuery(latestEventsQueryOptions)

  if (isPending) {
    return <NextChurchEventSkeleton />
  }

  if (isError || events.length === 0) {
    return null
  }

  const nextEvent = events[0]

  return (
    <Link
      to="/event/$slug"
      params={{ slug: nextEvent.slug }}
      className="flex flex-col items-center pt-10 text-background transition-opacity hover:opacity-80 dark:text-foreground"
    >
      <h3 className="mb-2 border-b border-muted-foreground font-semibold">Prochain événement</h3>
      <div className="space-y-1 text-xs">
        <div className="text-center">{formatDate(nextEvent.startDate.toISOString())}</div>

        <div className="font-bold">{nextEvent.title}</div>
        <div className="mt-4 flex justify-center">
          <Button variant="ghost" size="sm">
            Plus d'infos <ChevronRight className="ml-1 size-4" />
          </Button>
        </div>
      </div>
    </Link>
  )
}

function NextChurchEventSkeleton() {
  return (
    <div className="flex flex-col items-center pt-10">
      <Skeleton className="mb-2 h-4 w-40" />
      <div className="space-y-1 text-xs">
        <div className="flex justify-center">
          <Skeleton className="h-3 w-24" />
        </div>

        <div className="flex justify-center">
          <Skeleton className="h-4 w-32" />
        </div>

        <div className="mt-4 flex justify-center">
          <Skeleton className="h-5 w-28 rounded-md" />
        </div>
      </div>
    </div>
  )
}
