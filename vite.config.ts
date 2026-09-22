import { fileURLToPath } from 'node:url'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import babel from '@rolldown/plugin-babel'
import { sentryTanstackStart } from '@sentry/tanstackstart-react/vite'
import tailwindcss from '@tailwindcss/vite'
import viteReact, { reactCompilerPreset } from '@vitejs/plugin-react'
import { nitro } from 'nitro/vite'
import { defineConfig, loadEnv } from 'vite'
import { VERCEL_IMAGE_SIZES } from '#shared/lib/vercel-image-sizes.ts'

const isDev = process.env.NODE_ENV !== 'production'

const config = defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    logLevel: 'info',
    resolve: {
      tsconfigPaths: true,
    },
    env,
    define: {
      __SENTRY_ENVIRONMENT__: JSON.stringify(
        process.env.VERCEL_ENV ?? (mode === 'production' ? 'production' : 'development')
      ),
    },
    build: {
      target: 'chrome103',
      cssTarget: 'chrome111',
      minify: 'oxc',
      sourcemap: env.SENTRY_AUTH_TOKEN ? undefined : false,
    },
    plugins: [
      ...(isDev ? [devtools()] : []),
      nitro({
        sourcemap: false,
        experimental: { tasks: true },
        tasks: {
          cleanup: {
            handler: fileURLToPath(new URL('./src/server/tasks/cleanup.ts', import.meta.url)),
          },
        },
        scheduledTasks: {
          '0 3 * * *': ['cleanup'],
        },
        vercel: {
          config: {
            version: 3,
            images: {
              domains: [],
              sizes: VERCEL_IMAGE_SIZES,
              formats: ['image/avif', 'image/webp'],
              minimumCacheTTL: 60,
            },
          },
        },
      }),
      tailwindcss(),
      tanstackStart({
        importProtection: {
          behavior: 'error',
          client: {
            files: ['**/*.server.*', '**/server/**'],
          },
        },
      }),
      viteReact(),
      babel({ presets: [reactCompilerPreset()] }),
      ...(isDev
        ? []
        : [
            sentryTanstackStart({
              org: env.SENTRY_ORG,
              project: env.SENTRY_PROJECT,
              authToken: env.SENTRY_AUTH_TOKEN,
              autoInstrumentMiddleware: false,
              tunnelRoute: true,
            }),
          ]),
    ],
  }
})

export default config
