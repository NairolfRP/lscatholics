import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { AlertCircleIcon, CalendarX2Icon, ChurchIcon } from 'lucide-react'
import { ReadingCard } from '#/features/daily-readings/components/reading-card.tsx'
import { ReadingsHeader } from '#/features/daily-readings/components/readings-header.tsx'
import { ReadingsSidebar } from '#/features/daily-readings/components/readings-sidebar.tsx'
import { dailyReadingsQueryOptions } from '#/features/daily-readings/queries.ts'
import { todayISODate } from '#/features/daily-readings/schemas/daily-readings.schema.ts'
import type { AELFReadingsResponse } from '#/features/daily-readings/types/aelf.types.ts'
import { sortReadings } from '#/features/daily-readings/utils/readings.utils.ts'
import { Alert, AlertAction, AlertDescription, AlertTitle } from '#/shared/components/ui/alert.tsx'
import { Button } from '#/shared/components/ui/button.tsx'
import { Skeleton } from '#/shared/components/ui/skeleton.tsx'
import Hero from '#shared/layouts/app/components/hero.tsx'

export function DailyReadingsPage() {
  const today = useTodayISO()
  const { data, isPending, isError, refetch } = useQuery(dailyReadingsQueryOptions(today))

  return (
    <>
      <Hero
        variant="minimal"
        backgroundColor="bg-linear-to-r from-catholic-purple to-catholic-red"
        title="Lectures du jour"
        subtitle="La Parole de Dieu pour aujourd'hui, tirée de la liturgie de l'Église catholique"
      />

      <main className="container mx-auto px-4 pt-8 pb-24">
        <div className="mx-auto mt-6 grid max-w-7xl grid-cols-1 gap-10 lg:grid-cols-3 lg:gap-8">
          <div className="min-w-0 space-y-5 lg:col-span-2">
            {isPending && <DailyReadingsListSkeleton />}

            {isError && <DailyReadingsError onRetry={refetch} />}

            {!isPending && !isError && data && <DailyReadingsContent data={data} />}

            {!isPending && !isError && data === null && <DailyReadingsEmpty />}
          </div>

          <aside className="hidden lg:block print:hidden">
            {data ? (
              <div className="lg:sticky lg:top-[calc(var(--header-height)+1rem)] lg:flex lg:max-h-[calc(100vh-var(--header-height)-1rem)] lg:flex-col lg:overflow-hidden">
                <ReadingsSidebar messes={data.messes} />
              </div>
            ) : (
              <SidebarSkeleton />
            )}
          </aside>
        </div>
      </main>
    </>
  )
}

function useTodayISO(): string {
  const [date, setDate] = useState(todayISODate)

  useEffect(() => {
    const now = new Date()
    const nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
    const timer = setTimeout(() => setDate(todayISODate()), nextMidnight.getTime() - now.getTime())
    return () => clearTimeout(timer)
  }, [])

  return date
}

function DailyReadingsContent({ data }: { data: AELFReadingsResponse }) {
  const multiMass = data.messes.length > 1
  const hasReadings = data.messes.some((mass) => sortReadings(mass.lectures).length > 0)

  if (!hasReadings) {
    return <DailyReadingsEmpty />
  }

  return (
    <div className="space-y-6">
      <ReadingsHeader info={data.informations} />

      {multiMass ? (
        <div className="space-y-10">
          {data.messes.map((mass, massIndex) => (
            <section key={massIndex} className="space-y-5">
              <h3 className="flex items-center gap-2 text-lg font-bold">
                <ChurchIcon className="size-5 shrink-0 text-primary" />
                {mass.nom}
              </h3>
              <div className="space-y-5">
                {sortReadings(mass.lectures).map((reading, readingIndex) => (
                  <ReadingCard
                    key={`${massIndex}-${readingIndex}`}
                    reading={reading}
                    id={`lecture-${massIndex}-${readingIndex}`}
                    headingLevel={4}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="space-y-5">
          {sortReadings(data.messes[0].lectures).map((reading, readingIndex) => (
            <ReadingCard
              key={`0-${readingIndex}`}
              reading={reading}
              id={`lecture-0-${readingIndex}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function DailyReadingsEmpty() {
  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl bg-card px-6 py-16 text-center ring-1 ring-foreground/10">
      <span className="flex size-14 items-center justify-center rounded-full bg-muted">
        <CalendarX2Icon className="size-7 text-muted-foreground" />
      </span>
      <div>
        <h3 className="text-lg font-semibold">Aucune lecture disponible</h3>
        <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
          L'AELF n'a pas publié de lectures pour cette date. Revenez plus tard.
        </p>
      </div>
    </div>
  )
}

function DailyReadingsError({ onRetry }: { onRetry: () => void }) {
  return (
    <Alert variant="destructive" className="mx-auto max-w-2xl">
      <AlertCircleIcon />
      <AlertTitle>Lectures temporairement indisponibles</AlertTitle>
      <AlertDescription>
        Impossible de récupérer les lectures du jour auprès de l'AELF. Réessayez dans quelques
        instants.
      </AlertDescription>
      <AlertAction>
        <Button size="xs" onClick={onRetry}>
          Réessayer
        </Button>
      </AlertAction>
    </Alert>
  )
}

function DailyReadingsListSkeleton() {
  return (
    <>
      <ReadingsHeaderSkeleton />
      <ReadingCardSkeleton />
      <ReadingCardSkeleton />
      <ReadingCardSkeleton />
    </>
  )
}

export function DailyReadingsPageSkeleton() {
  return (
    <>
      <Hero
        variant="minimal"
        backgroundColor="bg-linear-to-r from-catholic-purple to-catholic-red"
        title="Lectures du jour"
        subtitle="La Parole de Dieu pour aujourd'hui, tirée de la liturgie de l'Église catholique"
      />

      <main className="container mx-auto px-4 pt-8 pb-24">
        <div className="mx-auto mt-6 grid max-w-7xl grid-cols-1 gap-10 lg:grid-cols-3 lg:gap-8">
          <div className="min-w-0 space-y-5 lg:col-span-2">
            <DailyReadingsListSkeleton />
          </div>
          <aside className="hidden lg:block">
            <SidebarSkeleton />
          </aside>
        </div>
      </main>
    </>
  )
}

function ReadingsHeaderSkeleton() {
  return (
    <div className="space-y-3 rounded-2xl bg-card p-6 ring-1 ring-foreground/10 sm:p-8">
      <Skeleton className="h-3 w-48" />
      <Skeleton className="h-8 w-3/4 max-w-sm" />
      <Skeleton className="h-3 w-64" />
      <div className="flex gap-2 pt-1">
        <Skeleton className="h-6 w-24 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
    </div>
  )
}

function ReadingCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10">
      <div className="flex items-center justify-between gap-3 border-b bg-muted/40 px-5 py-4">
        <div className="flex items-center gap-2.5">
          <Skeleton className="size-8 rounded-md" />
          <Skeleton className="h-5 w-32" />
        </div>
        <Skeleton className="h-4 w-24" />
      </div>
      <div className="space-y-3 px-5 py-5">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-1/3" />
      </div>
    </div>
  )
}

function SidebarSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-3 rounded-2xl bg-card p-5 ring-1 ring-foreground/10">
        <Skeleton className="h-3 w-28" />
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-full" />
        ))}
      </div>
      <div className="space-y-3 rounded-2xl bg-card p-5 ring-1 ring-foreground/10">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-4 w-20" />
      </div>
      <div className="space-y-3 rounded-2xl bg-card p-5 ring-1 ring-foreground/10">
        <Skeleton className="size-10 rounded-xl" />
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  )
}
