import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/events/show/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/events/show/$id"!</div>
}
