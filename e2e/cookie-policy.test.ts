import type { APIResponse } from 'playwright/test'
import { expect, test } from 'playwright/test'
import { createTestUser, deleteTestUser, getTestUserCookies } from './utils/helpers.ts'

const CEF_USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.5060.141 CitizenFX/1.0.0.36109 Safari/537.36'
const WEB_USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'

async function sessionCookieHeader(userId: string): Promise<string> {
  const cookies = await getTestUserCookies(userId)
  return cookies.map((c) => `${c.name}=${c.value}`).join('; ')
}

function setCookieHeaders(response: APIResponse): string[] {
  return response
    .headersArray()
    .filter((h) => h.name.toLowerCase() === 'set-cookie')
    .map((h) => h.value)
}

test.describe('Cookie SameSite policy', () => {
  test('auth cookies have SameSite=None and Secure for FiveM CEF requests', async ({
    request,
    context,
  }) => {
    const user = await createTestUser(context, 'user')
    const cookie = await sessionCookieHeader(user.id)

    const response = await request.fetch('/api/auth/sign-out', {
      method: 'POST',
      headers: {
        'User-Agent': CEF_USER_AGENT,
        'Content-Type': 'application/json',
        'Cookie': cookie,
      },
      data: {},
    })

    const cookies = setCookieHeaders(response)
    expect(cookies.length).toBeGreaterThan(0)
    for (const value of cookies) {
      expect(value).toContain('SameSite=None')
      expect(value).toContain('Secure')
    }

    await deleteTestUser(user.id)
  })

  test('auth cookies have SameSite=Lax for regular web requests', async ({ request, context }) => {
    const user = await createTestUser(context, 'user')
    const cookie = await sessionCookieHeader(user.id)

    const response = await request.fetch('/api/auth/sign-out', {
      method: 'POST',
      headers: {
        'User-Agent': WEB_USER_AGENT,
        'Content-Type': 'application/json',
        'Cookie': cookie,
      },
      data: {},
    })

    const cookies = setCookieHeaders(response)
    expect(cookies.length).toBeGreaterThan(0)
    for (const value of cookies) {
      expect(value).toContain('SameSite=Lax')
      expect(value).not.toContain('SameSite=None')
    }

    await deleteTestUser(user.id)
  })
})
