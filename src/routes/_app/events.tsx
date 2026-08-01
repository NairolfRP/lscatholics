import { createFileRoute, stripSearchParams } from '@tanstack/react-router'
import { ChurchEventsPage } from '#/features/church-event/components/church-events-page.tsx'
import { churchEventsQueryOptions } from '#/features/church-event/queries.ts'
import { churchEventsSearchSchema } from '#/features/church-event/schemas/church-event.schema.ts'
import { pageMetadata } from '#/utils/seo'

export const Route = createFileRoute('/_app/events')({
  validateSearch: churchEventsSearchSchema,
  search: {
    middlewares: [
      stripSearchParams({ year: new Date().getFullYear(), month: new Date().getMonth() + 1 }),
    ],
  },
  loaderDeps: ({ search }) => ({ year: search.year, month: search.month }),
  loader: async ({ context, deps }) => {
    await context.queryClient.ensureQueryData(churchEventsQueryOptions(deps))
  },
  head: () => ({
    meta: pageMetadata('Événements'),
  }),
  component: ChurchEventsPage,
})
