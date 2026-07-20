import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/event/$slug')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_app/event/$slug"!</div>
}
