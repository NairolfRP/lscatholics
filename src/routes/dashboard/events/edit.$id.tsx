import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/events/edit/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/events/edit/$id"!</div>
}
