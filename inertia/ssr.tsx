import { createInertiaApp } from '@inertiajs/react'
import Layout from '@/layouts/default'
import { resolvePageComponent } from '@adonisjs/inertia/helpers'
import ReactDOMServer from 'react-dom/server'
import type { Data } from '@generated/data'
import { ReactElement } from 'react'
import { client } from '@/lib/client'
import { TuyauProvider } from '@adonisjs/inertia/react'
import { QueryClientProvider } from '@tanstack/react-query'
import { createQueryClient } from '@/lib/query'

const appName = import.meta.env.VITE_APP_NAME || 'LS Catholics'

export default function render(page: any) {
  const queryClient = createQueryClient()

  return createInertiaApp({
    page,
    render: ReactDOMServer.renderToString,
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) => {
      return resolvePageComponent(
        `./pages/${name}.tsx`,
        import.meta.glob('./pages/**/*.tsx', { eager: true }),
        (page: ReactElement<Data.SharedProps>) => <Layout children={page} breadcrumb={[]} />
      )
    },

    setup({ App, props }) {
      return (
        <QueryClientProvider client={queryClient}>
          <TuyauProvider client={client}>
            <App {...props} />
          </TuyauProvider>
        </QueryClientProvider>
      )
    },
  })
}
