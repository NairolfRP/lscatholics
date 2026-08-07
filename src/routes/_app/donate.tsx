import { createFileRoute } from '@tanstack/react-router'
import { DonatePage } from '#/features/donate/components/donate-page.tsx'
import { pageMetadata } from '#/utils/seo.ts'

export const Route = createFileRoute('/_app/donate')({
  head: () => ({
    meta: pageMetadata('Faire un don'),
  }),
  component: DonatePage,
})
