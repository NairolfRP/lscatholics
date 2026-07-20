import { createFileRoute, Outlet } from '@tanstack/react-router'
import { DefaultNotFound } from '#/shared/components/ui/fallbacks/default-not-found'
import { AppLayout } from '#/shared/layouts/app/components/app-layout'
import appCss from '#/styles/app.css?url'

export const Route = createFileRoute('/_app')({
  head: () => ({
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  component: RouteComponent,
  notFoundComponent: DefaultNotFound,
})

function RouteComponent() {
  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  )
}
