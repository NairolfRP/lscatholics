import { createInertiaApp } from '@inertiajs/react'
import Layout from '@/layouts/default'
import { resolvePageComponent } from '@adonisjs/inertia/helpers'
import ReactDOMServer from 'react-dom/server'
import type { InertiaPageComponent } from '@/shared/types/pages'
import type { Data } from '@generated/data'
import { ReactElement } from 'react'
import { client } from '@/lib/client'
import { TuyauProvider } from '@adonisjs/inertia/react'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/query'

const appName = import.meta.env.VITE_APP_NAME || 'LS Catholics'

export default function render(page: any) {
  return createInertiaApp({
    page,
    render: ReactDOMServer.renderToString,
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: async (name) => {
      const pageComponent = await resolvePageComponent(
        `./pages/${name}.tsx`,
        import.meta.glob<{ default: InertiaPageComponent<Data.SharedProps> }>('./pages/**/*.tsx', {
          eager: true,
        })
      )

      pageComponent.default.layout =
        pageComponent.default.layout ||
        ((page) => <Layout children={page as ReactElement<Data.SharedProps>} />)

      return pageComponent
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
