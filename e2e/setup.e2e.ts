import type { FullConfig } from 'playwright/test'
import { execSync } from 'node:child_process'

export default async function globalSetup(_config: FullConfig) {
  console.log('⏳ Proceed database synchronisation...')

  try {
    execSync('bun run db:push', {
      stdio: 'inherit',
      env: process.env,
    })
    console.log('✅ Database schema successfully pushed!')
  } catch (error) {
    console.error('❌ Failed to sync database:', error)
    throw error
  }
}
