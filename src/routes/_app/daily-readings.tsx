import { createFileRoute } from '@tanstack/react-router'
import {
  DailyReadingsPage,
  DailyReadingsPageSkeleton,
} from '#/features/daily-readings/components/daily-readings-page.tsx'
import { pageMetadata } from '#/utils/seo'

export const Route = createFileRoute('/_app/daily-readings')({
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
  component: DailyReadingsPage,
})
