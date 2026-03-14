import { defineConfig } from '@adonisjs/inertia'

const inertiaConfig = defineConfig({
  ssr: {
    enabled: true,
    entrypoint: 'inertia/ssr.tsx',
    bundle: 'build/ssr/ssr.js',
    pages: (_ctx, page) => !page.startsWith('dashboard') && !page.startsWith('profile'),
  },
})

export default inertiaConfig
