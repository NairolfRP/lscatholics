import { defineConfig } from '@adonisjs/inertia'

const inertiaConfig = defineConfig({
  ssr: {
    enabled: true,
    entrypoint: 'inertia/ssr.ts',
    pages: (_ctx, page) => !page.startsWith('dashboard') && !page.startsWith('profile'),
  },
})

export default inertiaConfig
