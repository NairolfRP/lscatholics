import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/charities')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Outlet />
}
