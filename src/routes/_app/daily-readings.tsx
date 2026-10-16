import { createFileRoute } from '@tanstack/react-router'
import {
  DailyReadingsPage,
  DailyReadingsPageSkeleton,
} from '#/features/daily-readings/components/daily-readings-page.tsx'
import { dailyReadingsQueryOptions } from '#/features/daily-readings/queries.ts'
import { toISODate } from '#/features/daily-readings/schemas/daily-readings.schema.ts'
import { pageMetadata } from '#/utils/seo'

export const Route = createFileRoute('/_app/daily-readings')({
  loader: async ({ context }) => {
    const date = toISODate(new Date())
    await context.queryClient
      .query({ ...dailyReadingsQueryOptions(date), staleTime: 'static' })
      .catch(() => undefined)
    return { date }
  },
  pendingMs: 200,
  pendingComponent: DailyReadingsPageSkeleton,
  head: () => ({
    meta: pageMetadata('Lectures du jour', {
      metadata: {
        description:
          "La Parole de Dieu pour aujourd'hui : les lectures de la messe du jour, le psaume et l'évangile.",
      },
    }),
  }),
  component: DailyReadingsRoute,
})

function DailyReadingsRoute() {
  const { date } = Route.useLoaderData()
  return <DailyReadingsPage date={date} />
}
