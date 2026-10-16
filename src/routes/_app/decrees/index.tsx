import { createFileRoute } from '@tanstack/react-router'
import { DecreesPage, DecreesPageSkeleton } from '#/features/decree/components/decrees-page.tsx'
import { decreesQueryOptions } from '#/features/decree/queries.ts'
import { pageMetadata } from '#/utils/seo.ts'

export const Route = createFileRoute('/_app/decrees/')({
  loader: async ({ context }) => {
    await context.queryClient
      .query({ ...decreesQueryOptions, staleTime: 'static' })
      .catch(() => undefined)
  },
  pendingMs: 200,
  pendingComponent: DecreesPageSkeleton,
  head: () => ({
    meta: pageMetadata('Décrets et lois', {
      metadata: {
        description:
          "Les décrets et lois de l'Archidiocèse de Los Santos : décisions exécutives, lois canoniques, actes administratifs et jugements.",
        url: '/decrees',
      },
    }),
  }),
  component: DecreesPage,
})
