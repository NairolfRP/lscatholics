import { createFileRoute } from '@tanstack/react-router'
import {
  CatholicCharitiesPage,
} from '#/features/catholic-charities/components/catholic-charities-page'
import { pageMetadata } from '#/utils/seo'

export const Route = createFileRoute('/_app/charities/')({
  head: () => ({
    meta: pageMetadata('Catholic Charities', {
      metadata: {
        description:
          "Catholic Charities de l'Archidiocèse de Los Santos : aide alimentaire, logement, soutien aux familles et aux réfugiés, au nom de l'Évangile.",
      },
    }),
  }),
  component: CatholicCharitiesPage,
})
