import fs from 'node:fs'
import path from 'node:path'
import dotenv from 'dotenv'
import codspeedPlugin from '@codspeed/vitest-plugin'
import react from '@vitejs/plugin-react'
import { playwright } from '@vitest/browser-playwright'
import { defineConfig } from 'vitest/config'

const resolve = (filePath: string) => path.resolve(import.meta.dirname, filePath)

/**
 * Load only `.env.test` (+ `.env.test.local` if present) as the test
 * environment. `loadEnv` would also merge `.env.local`, which carries real
 * development secrets (DB URL, Discord tokens…) that must never reach tests.
 */
function loadTestEnv(): Record<string, string> {
  const testEnvPath = resolve('.env.test')
  const testLocalPath = resolve('.env.test.local')

  return {
    ...(fs.existsSync(testEnvPath) ? dotenv.parse(fs.readFileSync(testEnvPath, 'utf8')) : {}),
    ...(fs.existsSync(testLocalPath) ? dotenv.parse(fs.readFileSync(testLocalPath, 'utf8')) : {}),
  }
}

export default defineConfig({
  plugins: [react()],
  test: {
    env: loadTestEnv(),
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
          server: {
            deps: {
              inline: ['zod'],
            },
          },
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
})
