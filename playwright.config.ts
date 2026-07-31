import path from 'node:path'
import { defineConfig, devices } from '@playwright/test'
import dotenv from 'dotenv'

dotenv.config({ path: path.resolve(import.meta.dirname, '.env.e2e'), override: true })

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './e2e',
  globalSetup: './e2e/setup.e2e.ts',
  /* Max time for the full CI tests */
  globalTimeout: 15 * 60 * 1000,
  /* Max test failure */
  maxFailures: process.env.CI ? 1 : 0,
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: process.env.CI ? 'github' : 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    baseURL: process.env.VITE_BASE_URL || 'http://localhost:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

  /* Increase the timeout to operate on GitHub Actions */
  expect: { timeout: process.env.CI ? 15000 : 10000 },

  /* Configure projects for major browsers */
  projects: process.env.CI
    ? [
        { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
        { name: 'Mobile Safari', use: { ...devices['iPhone 14'] } },
      ]
    : [
        {
          name: 'chromium',
          use: { ...devices['Desktop Chrome'] },
        },
        {
          name: 'firefox',
          use: { ...devices['Desktop Firefox'] },
        },
        {
          name: 'webkit',
          use: { ...devices['Desktop Safari'] },
        },

        {
          name: 'Mobile Chrome',
          use: { ...devices['Pixel 7'] },
        },
        {
          name: 'Mobile Safari',
          use: { ...devices['iPhone 14'] },
        },
      ],

  /* Run your local dev server before starting the tests */
  webServer: [
    {
      command: 'turso dev --db-file tmp/e2e.db --port 8080',
      port: 8080,
      reuseExistingServer: !process.env.CI,
      stdout: 'pipe',
    },
    {
      command: 'vite --port 3000 --mode e2e',
      url: process.env.VITE_APP_URL || 'http://localhost:3000',
      reuseExistingServer: !process.env.CI,
      env: {
        ...(process.env as { [key: string]: string }),
      },
    },
  ],
})
