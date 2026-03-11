import '@/assets/css/app.css'
import type { InertiaPageComponent } from '@/types'
import { client, queryClient } from '@/client'
import Layout from '@/layouts/default'
import DashboardLayout from '@/layouts/dashboard'
import type { Data } from '@generated/data'
import { createRoot } from 'react-dom/client'
import { createInertiaApp } from '@inertiajs/react'
import { TuyauProvider } from '@adonisjs/inertia/react'
import { resolvePageComponent } from '@adonisjs/inertia/helpers'
import { hydrate, QueryClientProvider } from '@tanstack/react-query'
import { ReactElement } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { ErrorFallback } from '@/shared/components/error-fallback'

const appName = import.meta.env.VITE_APP_NAME || 'Archidiocèse de Los Santos'

createInertiaApp({
  progress: { color: '#5468FF' },

  title: (title) => (title ? `${title} - ${appName}` : appName),

  resolve: async (name) => {
    const pageComponent = await resolvePageComponent(
      `./pages/${name}.tsx`,
      import.meta.glob<{ default: InertiaPageComponent<Data.SharedProps> }>('./pages/**/*.tsx')
    )

    if (pageComponent.default.layout === undefined) {
      pageComponent.default.layout = name.startsWith('dashboard/')
        ? (page) => <DashboardLayout children={page as ReactElement<Data.SharedProps>} />
        : (page) => <Layout children={page as ReactElement<Data.SharedProps>} />
    }

    return pageComponent
  },

  setup({ el, App, props }) {
    if (props.initialPage.props.dehydratedState) {
      hydrate(queryClient, props.initialPage.props.dehydratedState)
    }

    createRoot(el).render(
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <QueryClientProvider client={queryClient}>
          <TuyauProvider client={client}>
            <App {...props} />
          </TuyauProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    )
  },
})
