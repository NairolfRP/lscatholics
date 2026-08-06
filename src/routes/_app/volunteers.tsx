import { createFileRoute } from '@tanstack/react-router'
import { pageMetadata } from '#/utils/seo.ts'
import { VolunteersPage } from '#/features/volunteers/components/volunteers-page.tsx'

export const Route = createFileRoute('/_app/volunteers')({
  head: () => ({
    meta: pageMetadata('Devenir bénévole', {
      metadata: {
        description:
          "Rejoignez les Charités catholiques de l'Archidiocèse de Los Santos. Les possibilités d'aider son prochain sont infinies. Vivez une expérience humaine riche et changez des vies.",
      },
    }),
  }),
  component: VolunteersPage,
})
