import path from 'node:path'
import codspeedPlugin from '@codspeed/vitest-plugin'
import react from '@vitejs/plugin-react'
import { playwright } from '@vitest/browser-playwright'
import { loadEnv } from 'vite'
import { defineConfig } from 'vitest/config'

const resolve = (filePath: string) => path.resolve(import.meta.dirname, filePath)

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  test: {
    env: loadEnv(mode, process.cwd(), ''),
    typecheck: { enabled: true },
    globals: true,
    watch: false,
    projects: [
      {
        plugins: [codspeedPlugin()],
        test: {
          name: 'bench',
          environment: 'node',
          include: ['tests/bench/**/*.bench.?(c|m)[jt]s?(x)'],
        },
        resolve: {
          tsconfigPaths: true,
          alias: {
            'drizzle-orm/libsql/web': 'drizzle-orm/libsql/node',
          },
        },
      },
      {
        test: {
          name: 'browser',
          browser: {
            enabled: true,
            provider: playwright({
              contextOptions: {
                permissions: ['clipboard-write', 'clipboard-read'],
              },
            }),
            instances: [{ browser: 'chromium' }],
          },
          include: ['tests/browser/**/*.{test,spec}.?(c|m)[jt]s?(x)'],
          setupFiles: [resolve('tests/setup.browser.ts')],
        },
        resolve: {
          tsconfigPaths: true,
        },
      },
      {
        test: {
          name: 'unit',
          environment: 'node',
          include: ['tests/unit/**/*.{test,spec}.?(c|m)[jt]s?(x)'],
          setupFiles: [resolve('tests/setup.unit.ts')],
          clearMocks: true,
        },
        resolve: {
          tsconfigPaths: true,
          alias: {
            'drizzle-orm/libsql/web': 'drizzle-orm/libsql/node',
          },
        },
      },
    ],
  },
}))
