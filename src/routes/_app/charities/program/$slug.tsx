import { createFileRoute, notFound } from '@tanstack/react-router'
import { ProgramShowPage } from '#/features/catholic-charities/components/program-show-page'
import { getProgramBySlug } from '#/features/catholic-charities/constants/programs.constants'
import { pageMetadata } from '#/utils/seo'

export const Route = createFileRoute('/_app/charities/program/$slug')({
  loader: ({ params }) => {
    const program = getProgramBySlug(params.slug)

    if (!program) {
      throw notFound()
    }

    return program
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? pageMetadata(loaderData.title, {
          metadata: { description: loaderData.description },
        })
      : [],
  }),
  component: ProgramShowRouteComponent,
})

function ProgramShowRouteComponent() {
  const program = Route.useLoaderData()

  return <ProgramShowPage program={program} />
}
