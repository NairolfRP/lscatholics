import { createRouter as createTanStackRouter } from '@tanstack/react-router'
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query'
import { getGlobalStartContext } from '@tanstack/react-start'
import * as Sentry from '@sentry/tanstackstart-react'
import { routeTree } from './routeTree.gen'
import { DefaultErrorComponent } from './shared/components/ui/fallbacks/default-error'
import { DefaultNotFound } from './shared/components/ui/fallbacks/default-not-found'
import { getContext } from './shared/integrations/tanstack-query/root-provider'
import { AppLayout } from './shared/layouts/app/components/app-layout'

export function getRouter() {
  const nonce = (getGlobalStartContext() as { nonce?: string } | undefined)?.nonce
  const context = getContext()

  const router = createTanStackRouter({
    routeTree,
    context,
    scrollRestoration: true,
    defaultViewTransition: true,
    defaultPreload: 'intent',
    defaultPreloadStaleTime: 0,
    defaultErrorComponent: DefaultErrorComponent,
    defaultNotFoundComponent: () => (
      <AppLayout>
        <DefaultNotFound />
      </AppLayout>
    ),
    ssr: {
      nonce,
    },
  })

  setupRouterSsrQueryIntegration({ router, queryClient: context.queryClient })

  if (import.meta.env.PROD && !router.isServer) {
    Sentry.addIntegration(Sentry.tanstackRouterBrowserTracingIntegration(router))
  }

  return router
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
