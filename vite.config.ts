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
    nitro({ rolldownConfig: { external: [/^@sentry\//, 'pino', 'pino-pretty'] } }),
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
