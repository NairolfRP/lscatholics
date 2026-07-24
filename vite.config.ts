import { fileURLToPath } from 'node:url'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
import viteReact, { reactCompilerPreset } from '@vitejs/plugin-react'
import { nitro } from 'nitro/vite'
import { defineConfig } from 'vite'

const config = defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [
    devtools(),
    nitro({
      experimental: { tasks: true },
      rolldownConfig: { external: [/^@sentry\//, 'pino', 'pino-pretty'] },
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
})

export default config
