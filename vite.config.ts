import { fileURLToPath } from 'node:url'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
import viteReact, { reactCompilerPreset } from '@vitejs/plugin-react'
import { nitro } from 'nitro/vite'
import { defineConfig, loadEnv } from 'vite'

const isDev = process.env.NODE_ENV !== 'production'

const config = defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    logLevel: 'info',
    resolve: {
      tsconfigPaths: true,
    },
    env,
    build: {
      minify: 'oxc',
      sourcemap: false,
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
    ],
  }
})

export default config
