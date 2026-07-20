import { TanStackDevtools } from '@tanstack/react-devtools'
import type { QueryClient } from '@tanstack/react-query'
import { HeadContent, Outlet, Scripts, createRootRouteWithContext } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { envClient } from '#/config/env-client'
import ScrollToTopButton from '#/shared/components/scroll-to-top'
import { Toaster } from '#/shared/components/ui/sonner'
import { ThemeProvider } from '#/shared/providers/theme-provider'
import { pageMetadata } from '#/utils/seo'
import TanStackQueryDevtools from '../shared/integrations/tanstack-query/devtools'
import appCss from '../styles/globals.css?url'

interface RouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<RouterContext>()({
  head: () => ({
    meta: pageMetadata(),
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
      {
        rel: 'icon',
        href: '/assets/images/favicon.ico',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: '/assets/images/icon-32.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        href: '/assets/images/icon-16.png',
      },
      {
        rel: 'apple-touch-icon',
        href: '/assets/images/apple-icon.png',
        sizes: '180x180',
      },
      {
        rel: 'manifest',
        href: '/manifest.json',
      },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument() {
  return (
    <html lang={envClient.VITE_LANGUAGE} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.bunny.net" />
        <link
          href="https://fonts.bunny.net/css?family=crimson-pro:200,300,400,500,600,700,800,900|geist-mono:400,600|inter:200,300,400,500,600,700,800,900&display=swap"
          rel="stylesheet"
        />
        <HeadContent />
      </head>
      <body
        className="flex min-h-svh flex-col bg-background font-sans text-foreground antialiased"
        suppressHydrationWarning
      >
        <ThemeProvider defaultTheme="light" storageKey="theme">
          <Outlet />
          <ScrollToTopButton />
          <Toaster position="top-right" richColors closeButton />
        </ThemeProvider>
        {import.meta.env.DEV && (
          <TanStackDevtools
            config={{
              position: 'bottom-left',
            }}
            plugins={[
              {
                name: 'Tanstack Router',
                render: <TanStackRouterDevtoolsPanel />,
              },
              TanStackQueryDevtools,
            ]}
          />
        )}
        <Scripts />
        <Analytics debug={false} />
        <SpeedInsights debug={false} />
      </body>
    </html>
  )
}
