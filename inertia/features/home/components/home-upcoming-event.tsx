import type { Data } from '@generated/data'
import { formatDate } from '@/lib/utils'
import { Button } from '@/shared/components/ui/button'
import { ChevronRight } from 'lucide-react'
import { Link } from '@adonisjs/inertia/react'

type Props = {
  event?: Data.ScheduledEvents.ScheduledEvent.Variants['home']
}

export function HomeUpcomingEvent({ event }: Props) {
  if (!event) return

  return (
    <Link route="event" routeParams={{ slug: event.slug }}>
      <div>
        <h3 className="font-semibold mb-2">Prochain événement</h3>
        <div className="space-y-1 text-xs">
          <div className="text-center">{formatDate(event.startDate!)}</div>

          <div className="font-bold">{event.title}</div>
          <div className="flex justify-end mt-4">
            <Button variant="ghost" size="sm">
              Voir plus <ChevronRight />
            </Button>
          </div>
        </div>
      </div>
    </Link>
  )
}
