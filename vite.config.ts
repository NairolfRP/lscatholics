import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
import adonisJS from '@adonisjs/vite/client'

export default defineConfig({
  plugins: [
    react(),
    babel({
      presets: [reactCompilerPreset()],
    }),
    tailwindcss(),
    adonisJS({
      entrypoints: ['inertia/app.tsx'],
      serverEntrypoints: ['inertia/ssr.tsx'],
      reload: ['resources/views/**/*.edge'],
    }),
  ],

  build: {
    minify: 'oxc',
    rolldownOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react-dom')) return 'vendor-react'
          if (id.includes('node_modules/@tanstack')) return 'vendor-tanstack'
          if (id.includes('node_modules/zod')) return 'vendor-zod'
          if (id.includes('node_modules/axios')) return 'vendor-axios'
        },
      },
    },
  },

  /**
   * Define aliases for importing modules from
   * your frontend code
   */
  resolve: {
    alias: {
      '@/': `${import.meta.dirname}/inertia/`,
      '#shared/': `${import.meta.dirname}/app/shared/`,
      '@generated/': `${import.meta.dirname}/.adonisjs/client/`,
    },
  },

  server: {
    watch: {
      ignored: ['**/storage/**', '**/tmp/**'],
    },
  },
})
