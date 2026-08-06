import { createFileRoute } from '@tanstack/react-router'
import { RegisterParishionerPage } from '#/features/parishioner/components/register-parishioner-page.tsx'
import { pageMetadata } from '#/utils/seo.ts'

export const Route = createFileRoute('/_app/register-parishioner')({
  head: () => ({
    meta: pageMetadata("S'enregistrer comme paroissien", {
      metadata: {
        description:
          "Nous sommes ravis que vous vous intéressiez à rejoindre notre famille de familles. L'enregistrement aide les paroisses de l'Archidiocèse de Los Santos à mieux vous servir et vous permet de rester en contact avec elles.",
      },
    }),
  }),
  component: RegisterParishionerPage,
})
