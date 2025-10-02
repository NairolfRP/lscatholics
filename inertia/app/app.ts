/// <reference path="../../adonisrc.ts" />
/// <reference path="../../config/inertia.ts" />
/// <reference path="../../config/ally.ts" />
/// <reference path="../../config/auth.ts" />

declare global {
  interface Window {
    __TANSTACK_QUERY_CLIENT__: import('@tanstack/vue-query').QueryClient
  }
}

import '@/assets/css/app.css'
import { createSSRApp, DefineComponent, h } from 'vue'
import { createInertiaApp } from '@inertiajs/vue3'
import { resolvePageComponent } from '@adonisjs/inertia/helpers'
import AppLayout from '@/layouts/AppLayout.vue'
import { TuyauPlugin } from '@tuyau/inertia/vue'
import { tuyau } from '@/lib/tuyau'
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query'

const appName = import.meta.env.VITE_APP_NAME || 'Archidiocèse de Los Santos'

const queryClient = new QueryClient()

createInertiaApp({
  progress: { color: '#5468FF' },

  title: (title) => (title ? `${title} - ${appName}` : `${appName}`),

  resolve: (name) => {
    const page = resolvePageComponent(
      `../pages/${name}.vue`,
      import.meta.glob<DefineComponent>('../pages/**/*.vue')
    )

    page.then((module) => {
      if (module.default.layout === undefined) {
        module.default.layout = AppLayout
      }
    })

    return page
  },

  setup({ el, App, props, plugin }) {
    window.__TANSTACK_QUERY_CLIENT__ = queryClient

    createSSRApp({ render: () => h(App, props) })
      .use(plugin)
      .use(TuyauPlugin, { client: tuyau })
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
