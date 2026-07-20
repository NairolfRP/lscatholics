import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/events/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/events/"!</div>
}
