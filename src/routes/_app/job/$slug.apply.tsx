import { createFileRoute } from '@tanstack/react-router'
import { pageMetadata } from '#/utils/seo.ts'

export const Route = createFileRoute('/_app/job/$slug/apply')({
  loader: ({ params: { slug } }) => {
    return { slug }
  },
  head: ({ loaderData }) => ({
    meta: loaderData ? pageMetadata(`Demande d'emploi`) : undefined,
  }),
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_app/job/$slug/apply"!</div>
}
