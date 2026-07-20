import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/events/create')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/events/create"!</div>
}
