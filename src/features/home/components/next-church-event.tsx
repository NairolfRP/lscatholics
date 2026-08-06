import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { ChevronRight } from 'lucide-react'
import { latestEventsQueryOptions } from '#/features/home/queries.ts'
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
      className="group inline-flex max-w-full flex-col items-center rounded-2xl border border-white/25 bg-black/25 px-8 py-5 text-center text-white backdrop-blur-sm transition hover:border-white/50 hover:bg-black/35 focus-visible:ring-2 focus-visible:ring-secondary focus-visible:outline-none"
    >
      <span className="text-xs font-semibold tracking-[0.25em] text-secondary uppercase">
        Prochain événement
      </span>
      <time className="mt-2 text-sm text-white/85">
        {formatDate(nextEvent.startDate.toISOString())}
      </time>
      <strong className="mt-1 text-lg leading-snug font-bold">{nextEvent.title}</strong>
      <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-secondary">
        Plus d'infos
        <ChevronRight className="size-4 transition-transform group-hover:translate-x-1" />
      </span>
    </Link>
  )
}

function NextChurchEventSkeleton() {
  return (
    <div className="flex max-w-full flex-col items-center rounded-2xl border border-white/25 bg-black/25 px-8 py-5">
      <Skeleton className="h-3 w-36 bg-white/20" />
      <Skeleton className="mt-2 h-3 w-24 bg-white/20" />
      <Skeleton className="mt-1 h-4 w-40 bg-white/20" />
      <Skeleton className="mt-3 h-4 w-28 bg-white/20" />
    </div>
  )
}
