import { createFileRoute } from '@tanstack/react-router'
import { pageMetadata } from '#/utils/seo'

export const Route = createFileRoute('/_app/events')({
  head: () => ({
    meta: pageMetadata('Événements'),
  }),
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_app/events"!</div>
}
