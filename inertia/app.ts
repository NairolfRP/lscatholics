import '@/assets/css/app.css'
import { createApp, type DefineComponent, h } from 'vue'
import { createInertiaApp, router } from '@inertiajs/vue3'
import { resolvePageComponent } from '@adonisjs/inertia/helpers'
import AppLayout from '@/layouts/AppLayout.vue'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import { hydrate, QueryClient, VueQueryPlugin } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'
import { client } from '@/client'
import { TuyauProvider } from '@adonisjs/inertia/vue'

const appName = import.meta.env.VITE_APP_NAME || 'Archidiocèse de Los Santos'

createInertiaApp({
  progress: { color: '#5468FF' },

  title: (title) => (title ? `${title} - ${appName}` : appName),

  resolve: async (name) => {
    const pageComponent = await resolvePageComponent(
      `./pages/${name}.vue`,
      import.meta.glob<DefineComponent>('./pages/**/*.vue')
    )

    if (pageComponent.default.layout === undefined) {
      pageComponent.default.layout = name.startsWith('dashboard/') ? DashboardLayout : AppLayout
    }

    return pageComponent
  },

  setup({ el, App, props, plugin }) {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 1000 * 60 * 5,
          retry: 1,
          refetchOnWindowFocus: false,
        },
      },
    })

    if (props.initialPage.props.dehydratedState) {
      hydrate(queryClient, props.initialPage.props.dehydratedState)
    }

    createApp({ render: () => h(TuyauProvider, { client }, { default: () => h(App, props) }) })
      .use(plugin)
      .use(VueQueryPlugin, { queryClient })
      .mount(el)
  },
})

router.on('navigate', (event) => {
  const errors = event.detail.page.props.errors

  const E_AUTHENTIFICATION_FAILED = errors?.E_AUTHENTIFICATION_FAILED
  if (E_AUTHENTIFICATION_FAILED) {
    toast.error(E_AUTHENTIFICATION_FAILED)
  }
})
