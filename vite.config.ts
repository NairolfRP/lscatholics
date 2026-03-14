import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
import adonisjs from '@adonisjs/vite/client'
import inertia from '@adonisjs/inertia/vite'

export default defineConfig({
  plugins: [
    react(),
    babel({
      presets: [reactCompilerPreset()],
    }),
    tailwindcss(),
    inertia({ ssr: { enabled: true, entrypoint: 'inertia/ssr.tsx' } }),
    adonisjs({ entrypoints: ['inertia/app.tsx'], reload: ['resources/views/**/*.edge'] }),
  ],

  /*build: {
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react-dom')) return 'vendor-react'
          if (id.includes('node_modules/@tanstack')) return 'vendor-tanstack'
          if (id.includes('node_modules/zod')) return 'vendor-zod'
          if (id.includes('node_modules/axios')) return 'vendor-axios'
        },
      },
    },
  },*/

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
