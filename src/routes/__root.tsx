import { lazy, Suspense } from 'react'
import type { QueryClient } from '@tanstack/react-query'
import { createRootRouteWithContext, HeadContent, Outlet, Scripts } from '@tanstack/react-router'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { envClient } from '#/config/env-client'
import ScrollToTopButton from '#/shared/components/scroll-to-top'
import { Toaster } from '#/shared/components/ui/toast'
import { ThemeProvider } from '#/shared/providers/theme-provider'
import { pageMetadata } from '#/utils/seo'
import '#/styles/globals.css'

const LazyAppDevtools = import.meta.env.DEV
  ? lazy(() =>
      import('#shared/components/app-devtools').then((m) => ({
        default: m.AppDevtools,
      }))
    )
  : null

interface RouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<RouterContext>()({
  head: () => ({
    meta: pageMetadata(),
    links: [
      {
        rel: 'preconnect',
        href: 'https://fonts.bunny.net',
        crossOrigin: '',
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.bunny.net/css?family=crimson-pro:200,300,400,500,600,700,800,900|geist-mono:400,600|inter:200,300,400,500,600,700,800,900&display=swap',
      },
      {
        rel: 'preload',
        as: 'font',
        type: 'font/woff2',
        href: 'https://fonts.bunny.net/inter/files/inter-latin-400-normal.woff2',
        crossOrigin: '',
        fetchPriority: 'high',
      },
      {
        rel: 'preload',
        as: 'font',
        type: 'font/woff2',
        href: 'https://fonts.bunny.net/inter/files/inter-latin-700-normal.woff2',
        crossOrigin: '',
      },
      {
        rel: 'preload',
        as: 'font',
        type: 'font/woff2',
        href: 'https://fonts.bunny.net/crimson-pro/files/crimson-pro-latin-400-normal.woff2',
        crossOrigin: '',
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
        <HeadContent />
      </head>
      <body
        className="flex min-h-svh flex-col bg-background font-sans text-foreground antialiased"
        suppressHydrationWarning
      >
        <ThemeProvider defaultTheme="light" storageKey="theme">
          <Outlet />
          <ScrollToTopButton />
          <Toaster />
        </ThemeProvider>
        {LazyAppDevtools && (
          <Suspense fallback={null}>
            <LazyAppDevtools />
          </Suspense>
        )}
        <Scripts />
        <Analytics debug={false} />
        <SpeedInsights debug={false} />
      </body>
    </html>
  )
}
