import { useState } from 'react'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { CalendarDaysIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import { addMonths, formatYearMonth } from '#/utils/date.ts'
import { Button } from '#shared/components/ui/button.tsx'
import { Skeleton } from '#shared/components/ui/skeleton.tsx'
import { Typography } from '#shared/components/ui/typography.tsx'
import {
  CHURCH_EVENT_FORWARD_YEARS,
  CHURCH_EVENT_LOOKBACK_MONTHS,
} from '#shared/constants/church-event.constants.ts'

export function ChurchEventsMonthNavigation() {
  const navigate = useNavigate({ from: '/events' })
  const search = useSearch({ from: '/_app/events' })
  const [isNavigating, setIsNavigating] = useState(false)

  const now = new Date()
  const minDate = addMonths(now, -CHURCH_EVENT_LOOKBACK_MONTHS)
  const minYearMonth = { year: minDate.getFullYear(), month: minDate.getMonth() + 1 }
  const maxYearMonth = { year: now.getFullYear() + CHURCH_EVENT_FORWARD_YEARS, month: 12 }

  const currentYearMonth = { year: now.getFullYear(), month: now.getMonth() + 1 }
  const isCurrentMonth =
    search.year === currentYearMonth.year && search.month === currentYearMonth.month

  const getFormattedYearMonth = () => {
    const yearMonthDate = new Date(search.year, search.month - 1, 1)
    const formattedDate = formatYearMonth(yearMonthDate)
    return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1)
  }

  const navigateToMonth = async (yearMonth: { year: number; month: number }) => {
    if (isNavigating) return // bloque le clic tant qu'une navigation est en vol
    setIsNavigating(true)
    try {
      await navigate({ search: yearMonth })
    } finally {
      setIsNavigating(false)
    }
  }

  const goToMonth = (option: 'prev' | 'next') => {
    const newDate = addMonths(
      new Date(search.year, search.month - 1, 1),
      option === 'prev' ? -1 : 1
    )
    return navigateToMonth({ year: newDate.getFullYear(), month: newDate.getMonth() + 1 })
  }

  const canGoPrev =
    search.year > minYearMonth.year ||
    (search.year === minYearMonth.year && search.month > minYearMonth.month)
  const canGoNext =
    search.year < maxYearMonth.year ||
    (search.year === maxYearMonth.year && search.month < maxYearMonth.month)

  return (
    <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-2 rounded-2xl bg-card p-3 shadow-xs ring-1 ring-foreground/10 sm:gap-4 sm:p-4">
      <Button
        variant="outline"
        onClick={() => goToMonth('prev')}
        disabled={!canGoPrev || isNavigating}
        aria-label="Mois précédent"
        className="shrink-0 px-2 sm:px-3"
      >
        <ChevronLeftIcon />
        <span className="hidden md:inline">Précédent</span>
      </Button>

      <div className="flex min-w-0 flex-col items-center gap-1 text-center">
        <Typography variant="h2" className="border-b-0 pb-0 text-base font-semibold sm:text-2xl">
          {getFormattedYearMonth()}
        </Typography>
        {!isCurrentMonth && (
          <Button
            variant="ghost"
            size="xs"
            onClick={() => navigateToMonth(currentYearMonth)}
            disabled={isNavigating}
            className="text-muted-foreground"
          >
            <CalendarDaysIcon />
            Aujourd'hui
          </Button>
        )}
      </div>

      <Button
        variant="outline"
        onClick={() => goToMonth('next')}
        disabled={!canGoNext || isNavigating}
        aria-label="Mois suivant"
        className="shrink-0 px-2 sm:px-3"
      >
        <span className="hidden md:inline">Suivant</span>
        <ChevronRightIcon />
      </Button>
    </div>
  )
}

export function ChurchEventsMonthNavigationSkeleton() {
  return (
    <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-2 rounded-2xl bg-card p-3 shadow-xs ring-1 ring-foreground/10 sm:gap-4 sm:p-4">
      <Skeleton className="h-9 w-10 sm:w-28" />
      <Skeleton className="h-7 w-36 rounded-md sm:w-44" />
      <Skeleton className="h-9 w-10 sm:w-28" />
    </div>
  )
}
