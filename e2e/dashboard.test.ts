import { expect, test } from 'playwright/test'
import { createTestUser, deleteTestUser, getTestUserCookies } from './utils/helpers.ts'

test.describe('Dashboard - Authentificated Admin', () => {
  test('dashboard index is loading', async ({ page, context }) => {
    const user = await createTestUser(context, 'admin')
    const cookies = await getTestUserCookies(user.id)

    await context.addCookies(cookies)

    await page.goto('/dashboard')
    await expect(page.getByText('Test admin')).toBeVisible()

    await deleteTestUser(user.id)
  })
})

test.describe('Dashboard - Unauthorized User/Guest', () => {
  test('guest redirected from /dashboard to homepage', async ({ page }) => {
    await page.goto('/dashboard')
    await page.waitForURL('**/')
    expect(page.url()).not.toContain('/dashboard')
  })

  test('user redirected from /dashboard to homepage', async ({ page, context }) => {
    const user = await createTestUser(context)
    const cookies = await getTestUserCookies(user.id)

    await context.addCookies(cookies)

    await page.goto('/dashboard')
    await page.waitForURL('**/')
    expect(page.url()).not.toContain('/dashboard')

    await deleteTestUser(user.id)
  })
})
