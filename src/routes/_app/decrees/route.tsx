import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/decrees')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Outlet />
}
