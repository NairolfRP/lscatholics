import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/posts/create')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/posts/create"!</div>
}
