import { fileURLToPath } from 'node:url'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import babel from '@rolldown/plugin-babel'
import { sentryTanstackStart } from '@sentry/tanstackstart-react/vite'
import tailwindcss from '@tailwindcss/vite'
import viteReact, { reactCompilerPreset } from '@vitejs/plugin-react'
import { nitro } from 'nitro/vite'
import { defineConfig, loadEnv } from 'vite'

const isDev = process.env.NODE_ENV !== 'production'
const isProd = process.env.NODE_ENV === 'production'

const shouldUseSentryPlugin = isProd && Boolean(process.env.SENTRY_AUTH_TOKEN)
const shouldBuildSourcemaps = shouldUseSentryPlugin || process.env.BUILD_SOURCEMAPS === 'true'

const config = defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    logLevel: 'info',
    resolve: {
      tsconfigPaths: true,
    },
    env,
    build: {
      chunkSizeWarningLimit: 4_000,
      minify: 'oxc',
      sourcemap: shouldBuildSourcemaps,
      reportCompressedSize: false,
      rolldownOptions: {
        output: {
          codeSplitting: {
            groups: [
              {
                test: /[\\/]node_modules[\\/]@tanstack[\\/](react-start|start-)/,
                name: 'tanstack-start',
              },
              {
                test: /[\\/]node_modules[\\/]@tanstack[\\/](react-router|router-core|history)/,
                name: 'tanstack-router',
              },
              {
                test: /[\\/]node_modules[\\/]@tanstack[\\/](react-query|query-core)/,
                name: 'tanstack-query',
              },
              {
                test: /[\\/]node_modules[\\/](react-dom|react|scheduler)[\\/]/,
                name: 'react',
              },
            ],
          },
        },
      },
    },
    plugins: [
      ...(isDev ? [devtools()] : []),
      nitro({
        experimental: { tasks: true },
        tasks: {
          cleanup: {
            handler: fileURLToPath(new URL('./src/server/tasks/cleanup.ts', import.meta.url)),
          },
        },
        scheduledTasks: {
          '0 3 * * *': ['cleanup'],
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
      ...(shouldUseSentryPlugin
        ? [
          sentryTanstackStart({
            org: env.VITE_SENTRY_ORG,
            project: env.VITE_SENTRY_PROJECT,
            authToken: process.env.SENTRY_AUTH_TOKEN,
            telemetry: false,
          }),
        ]
        : []),
    ],
  }
})

export default config
