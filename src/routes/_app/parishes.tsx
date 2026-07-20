import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/parishes')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_app/parishes"!</div>
}
