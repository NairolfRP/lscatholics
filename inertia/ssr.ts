import { createInertiaApp } from '@inertiajs/vue3'
import { renderToString } from '@vue/server-renderer'
import { createSSRApp, type DefineComponent, h } from 'vue'
import AppLayout from '@/layouts/AppLayout.vue'
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query'
import { TuyauProvider } from '@adonisjs/inertia/vue'
import { client } from '@/client'
import { resolvePageComponent } from '@adonisjs/inertia/helpers'

export default function render(page: any) {
  return createInertiaApp({
    page,
    render: renderToString,
    resolve: async (name) => {
      const pageComponent = await resolvePageComponent(
        `./pages/${name}.vue`,
        import.meta.glob<DefineComponent>('./pages/**/*.vue', { eager: true })
      )

      pageComponent.default.layout = pageComponent.default.layout || AppLayout

      return pageComponent
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

      return createSSRApp({
        render: () => h(TuyauProvider, { client }, { default: () => h(App, props) }),
      })
        .use(plugin)
        .use(VueQueryPlugin, { queryClient })
    },
  })
}
