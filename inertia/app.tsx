import '@/assets/css/app.css'
import type { InertiaPageComponent } from '@/shared/types/pages'
import { client } from '@/lib/client'
import Layout from '@/layouts/default'
import type { Data } from '@generated/data'
import { createRoot } from 'react-dom/client'
import { createInertiaApp } from '@inertiajs/react'
import { TuyauProvider } from '@adonisjs/inertia/react'
import { resolvePageComponent } from '@adonisjs/inertia/helpers'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactElement, StrictMode } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { ErrorFallback } from '@/shared/components/error-fallback'
import ScrollToTopButton from '@/shared/components/scroll-to-top-button'
import { Toaster } from 'sonner'
import { queryClient } from '@/lib/query'

const appName = import.meta.env.VITE_APP_NAME || 'LS Catholics'

createInertiaApp({
  progress: { color: '#5468FF' },

  title: (title) => (title ? `${title} - ${appName}` : appName),

  resolve: async (name) => {
    const pageComponent = await resolvePageComponent(
      `./pages/${name}.tsx`,
      import.meta.glob<{ default: InertiaPageComponent<Data.SharedProps> }>('./pages/**/*.tsx')
    )

    if (pageComponent.default.layout === undefined) {
      if (name.startsWith('dashboard/')) {
        const { default: DashboardLayout } = await import('@/layouts/dashboard')
        pageComponent.default.layout = (page) => (
          <DashboardLayout children={page as ReactElement<Data.SharedProps>} />
        )
      } else {
        pageComponent.default.layout = (page) => (
          <Layout children={page as ReactElement<Data.SharedProps>} />
        )
      }
    }

    return pageComponent
  },

  setup({ el, App, props }) {
    const root = createRoot(el)

    root.render(
      <StrictMode>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <QueryClientProvider client={queryClient}>
            <TuyauProvider client={client}>
              <Toaster position="top-center" richColors closeButton />
              <App {...props} />
              <ScrollToTopButton />
            </TuyauProvider>
          </QueryClientProvider>
        </ErrorBoundary>
      </StrictMode>
    )
  },
})
