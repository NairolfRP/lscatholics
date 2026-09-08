import { createFileRoute } from '@tanstack/react-router'
import { SpontaneousApplicationPage } from '#/features/job-application/components/spontaneous-application-page.tsx'
import { pageMetadata } from '#/utils/seo.ts'

export const Route = createFileRoute('/_app/careers/spontaneous-apply')({
  head: () => ({
    meta: pageMetadata('Candidature spontanée', {
      metadata: {
        description:
          "Aucune offre d'emploi actuelle ne vous correspond ? Déposez une candidature spontanée auprès de l'Archidiocèse de Los Santos.",
        url: '/careers/spontaneous-apply',
      },
    }),
  }),
  component: SpontaneousApplicationPage,
})
