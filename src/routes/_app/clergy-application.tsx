import { createFileRoute, stripSearchParams } from '@tanstack/react-router'
import {
  ClergyApplicationPage,
} from '#/features/clergy-application/components/clergy-application-page.tsx'
import {
  clergyApplicationPageSearchSchema,
} from '#/features/clergy-application/schemas/clergy-application.schema.ts'
import { pageMetadata } from '#/utils/seo.ts'

export const Route = createFileRoute('/_app/clergy-application')({
  validateSearch: clergyApplicationPageSearchSchema,
  search: {
    middlewares: [stripSearchParams({ role: null })],
  },
  head: () => ({
    meta: pageMetadata('(( Rejoindre le clergé ))'),
  }),
  component: ClergyApplicationPage,
})
