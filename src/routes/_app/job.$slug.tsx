import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/job/$slug')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_app/job/$slug"!</div>
}
