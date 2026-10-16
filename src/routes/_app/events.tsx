import { createFileRoute, stripSearchParams } from '@tanstack/react-router'
import {
  ChurchEventsPage,
  ChurchEventsPageSkeleton,
} from '#/features/church-event/components/church-events-page.tsx'
import { churchEventsQueryOptions } from '#/features/church-event/queries.ts'
import {
  churchEventsDefaultSearch,
  churchEventsSearchSchema,
} from '#/features/church-event/schemas/church-event.schema.ts'
import { pageMetadata } from '#/utils/seo'

export const Route = createFileRoute('/_app/events')({
  validateSearch: churchEventsSearchSchema,
  search: {
    middlewares: [stripSearchParams(churchEventsDefaultSearch)],
  },
  loaderDeps: ({ search }) => ({ year: search.year, month: search.month }),
  loader: async ({ context, deps }) => {
    await context.queryClient.query({ ...churchEventsQueryOptions(deps), staleTime: 'static' })
    return { now: new Date().toISOString() }
  },
  pendingMs: 200,
  pendingComponent: ChurchEventsPageSkeleton,
  head: () => ({
    meta: pageMetadata('Événements'),
  }),
  component: ChurchEventsPage,
})
