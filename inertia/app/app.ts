/// <reference path="../../adonisrc.ts" />
/// <reference path="../../config/inertia.ts" />

import 'inertia/css/app.css'
import type { DefineComponent } from 'vue'
import { createSSRApp, h } from 'vue'
import { createInertiaApp } from '@inertiajs/vue3'
import { resolvePageComponent } from '@adonisjs/inertia/helpers'
import { TuyauPlugin } from '@tuyau/inertia/vue'
import { tuyau } from '@/lib/tuyau'

const appName = import.meta.env.VITE_APP_NAME || 'Archidiocèse de Los Santos'

createInertiaApp({
  progress: { color: '#5468FF' },

  title: (title) => (title ? `${title} - ${appName}` : `${appName}`),

  resolve: (name) => {
    return resolvePageComponent(
      `../pages/${name}.vue`,
      import.meta.glob<DefineComponent>('../pages/**/*.vue')
    )
  },

  setup({ el, App, props, plugin }) {
    createSSRApp({ render: () => h(App, props) })
      .use(plugin)
      .use(TuyauPlugin, { client: tuyau })
      .mount(el)
  },
})
