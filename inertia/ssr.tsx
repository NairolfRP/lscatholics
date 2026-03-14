import { createInertiaApp } from '@inertiajs/react'
import Layout from '@/layouts/default'
import { QueryClientProvider } from '@tanstack/react-query'
import { TuyauProvider } from '@adonisjs/inertia/react'
import { client, queryClient } from '@/client'
import { resolvePageComponent } from '@adonisjs/inertia/helpers'
import ReactDOMServer from 'react-dom/server'
import type { InertiaPageComponent } from '@/types'
import type { Data } from '@generated/data'
import { ReactElement } from 'react'

export default function render(page: any) {
  return createInertiaApp({
    page,
    render: ReactDOMServer.renderToString,
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
