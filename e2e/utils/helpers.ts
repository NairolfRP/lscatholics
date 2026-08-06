import type { BrowserContext } from '@playwright/test'
import crypto from 'node:crypto'
import { auth } from '#server/integrations/auth.server.ts'
import type { User } from '#shared/lib/types/auth.ts'

export async function createTestUser(
  context: BrowserContext,
  role: 'admin' | 'user' = 'user',
  override: Partial<User> = {}
) {
  const ctx = await auth.$context
  const testUtils = ctx.test

  const email = `user-${crypto.randomUUID()}@test.com`

  const user = testUtils.createUser({
    name: `Test ${role}`,
    email,
    emailVerified: false,
    role,
    banned: false,
    ...override,
  })
  await testUtils.saveUser(user)

  const cookies = await testUtils.getCookies({
    userId: user.id,
    domain: 'localhost',
  })
  await context.addCookies(cookies)

  return user
}

export async function loginTestUser(userId: string) {
  const ctx = await auth.$context
  const testUtils = ctx.test

  return await testUtils.login({ userId })
}

export async function getTestUserCookies(userId: string) {
  const ctx = await auth.$context
  const testUtils = ctx.test

  return await testUtils.getCookies({
    userId,
  })
}

export async function deleteTestUser(userId: string) {
  const ctx = await auth.$context
  const testUtils = ctx.test

  await testUtils.deleteUser(userId)
}
