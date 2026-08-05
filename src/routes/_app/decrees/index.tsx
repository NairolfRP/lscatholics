import { createFileRoute } from '@tanstack/react-router'
import { DecreesPage, DecreesPageSkeleton } from '#/features/decree/components/decrees-page.tsx'
import { pageMetadata } from '#/utils/seo.ts'

export const Route = createFileRoute('/_app/decrees/')({
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
