import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { DashboardPendingComponent } from '#/features/dashboard/components/dashboard-pending-component.tsx'
import { getGameContextFn } from '#/server-fn/game.functions'
import { DefaultNotFound } from '#/shared/components/ui/fallbacks/default-not-found'
import { DashboardLayout } from '#/shared/layouts/dashboard/components/dashboard-layout'
import { gameContextQueryOptions } from '#/shared/queries/game.queries'

export const Route = createFileRoute('/dashboard')({
  beforeLoad: async ({ context }) => {
    const gameContext = await getGameContextFn()
    if (!gameContext.canAccessDashboard) {
      throw redirect({
        to: '/',
      })
    }

    context.queryClient.setQueryData(gameContextQueryOptions.queryKey, gameContext)

    return { gameContext }
  },
  pendingMs: 500,
  pendingComponent: DashboardPendingComponent,
  staleTime: 30_000,
  component: RouteComponent,
  notFoundComponent: DefaultNotFound,
  ssr: 'data-only',
})

function RouteComponent() {
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  )
}
