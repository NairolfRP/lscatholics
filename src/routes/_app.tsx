import { createFileRoute, Outlet } from '@tanstack/react-router'
import { DefaultNotFound } from '#/shared/components/ui/fallbacks/default-not-found'
import { AppLayout } from '#/shared/layouts/app/components/app-layout'
import { gameContextQueryOptions } from '#/shared/queries/game.queries'
import { TooltipProvider } from '#shared/components/ui/tooltip.tsx'
import appCss from '#/styles/app.css?url'

const GAME_CONTEXT_SSR_TIMEOUT_MS = 2000

export const Route = createFileRoute('/_app')({
  beforeLoad: async ({ context }) => {
    const gameContext = context.queryClient
      .query({ ...gameContextQueryOptions, staleTime: 'static' })
      .catch(() => {})

    await Promise.race([
      gameContext,
      new Promise((resolve) => setTimeout(resolve, GAME_CONTEXT_SSR_TIMEOUT_MS)),
    ])
  },
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
    <TooltipProvider>
      <AppLayout>
        <Outlet />
      </AppLayout>
    </TooltipProvider>
  )
}
