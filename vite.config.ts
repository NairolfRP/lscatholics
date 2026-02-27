import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import adonisjs from '@adonisjs/vite/client'
import inertia from '@adonisjs/inertia/vite'

export default defineConfig({
  plugins: [
    vue(),
    inertia({ ssr: { enabled: true, entrypoint: 'inertia/ssr.ts' } }),
    tailwindcss(),
    adonisjs({ entrypoints: ['inertia/app.ts'], reload: ['resources/views/**/*.edge'] }),
  ],

  /**
   * Define aliases for importing modules from
   * your frontend code
   */
  resolve: {
    alias: {
      '@/': `${import.meta.dirname}/inertia/`,
      '#shared/': `${import.meta.dirname}/app/shared/`,
      '@generated': `${import.meta.dirname}/.adonisjs/client/`,
    },
  },

  server: {
    watch: {
      ignored: ['**/storage/**', '**/tmp/**'],
    },
  },
})
