import { useState } from 'react'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import { addMonths, formatYearMonth } from '#/utils/date.ts'
import { Button } from '#shared/components/ui/button.tsx'
import { Typography } from '#shared/components/ui/typography.tsx'
import {
  CHURCH_EVENT_FORWARD_YEARS,
  CHURCH_EVENT_LOOKBACK_MONTHS,
} from '#shared/constants/church-event.constants.ts'

export function ChurchEventsMonthNavigation() {
  const navigate = useNavigate({ from: '/events' })
  const search = useSearch({ from: '/_app/events' })
  const [isNavigating, setIsNavigating] = useState(false)

  const minDate = addMonths(new Date(), -CHURCH_EVENT_LOOKBACK_MONTHS)
  const minYearMonth = { year: minDate.getFullYear(), month: minDate.getMonth() + 1 }
  const maxYearMonth = { year: new Date().getFullYear() + CHURCH_EVENT_FORWARD_YEARS, month: 12 }

  const getFormattedYearMonth = () => {
    const yearMonthDate = new Date(search.year, search.month - 1, 1)
    const formattedDate = formatYearMonth(yearMonthDate)
    return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1)
  }

  const goToMonth = async (option: 'prev' | 'next') => {
    if (isNavigating) return // bloque le clic tant qu'une navigation est en vol
    const newDate = addMonths(
      new Date(search.year, search.month - 1, 1),
      option === 'prev' ? -1 : 1
    )
    setIsNavigating(true)
    try {
      await navigate({ search: { year: newDate.getFullYear(), month: newDate.getMonth() + 1 } })
    } finally {
      setIsNavigating(false)
    }
  }

  const canGoPrev =
    search.year > minYearMonth.year ||
    (search.year === minYearMonth.year && search.month > minYearMonth.month)
  const canGoNext =
    search.year < maxYearMonth.year ||
    (search.year === maxYearMonth.year && search.month < maxYearMonth.month)

  return (
    <div className="mx-auto flex w-full max-w-3xl items-center justify-between rounded-md bg-muted p-5">
      <Button onClick={() => goToMonth('prev')} disabled={!canGoPrev || isNavigating}>
        <ChevronLeftIcon /> <span className="hidden md:inline-block">Précédent</span>
      </Button>
      <Typography
        variant="h2"
        className="border-b-0 pb-0 text-center text-base sm:text-3xl md:text-3xl"
      >
        {getFormattedYearMonth()}
      </Typography>
      <Button onClick={() => goToMonth('next')} disabled={!canGoNext || isNavigating}>
        <span className="hidden md:inline-block">Suivant</span> <ChevronRightIcon />
      </Button>
    </div>
  )
}
