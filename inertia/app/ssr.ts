import { createInertiaApp } from '@inertiajs/vue3'
import { renderToString } from '@vue/server-renderer'
import { createSSRApp, type DefineComponent, h } from 'vue'
import AppLayout from '@/layouts/AppLayout.vue'
import { TuyauPlugin } from '@tuyau/inertia/vue'
import { tuyau } from '@/lib/tuyau'
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query'

export default function render(page: any) {
  return createInertiaApp({
    page,
    render: renderToString,
    resolve: (name) => {
      const pages = import.meta.glob<DefineComponent>('../pages/**/*.vue', { eager: true })
      let resolvedPage = pages[`../pages/${name}.vue`]

      resolvedPage.default.layout = resolvedPage.default.layout || AppLayout

      return resolvedPage
    },

    setup({ App, props, plugin }) {
      const queryClient = new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5,
            retry: false,
            suspense: false,
          },
        },
      })

      return createSSRApp({ render: () => h(App, props) })
        .use(plugin)
        .use(TuyauPlugin, { client: tuyau })
        .use(VueQueryPlugin, { queryClient })
    },
  })
}
