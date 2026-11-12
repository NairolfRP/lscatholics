import { expect, test } from 'playwright/test'
import {
  createTestUser,
  deleteTestUser,
  getTestUserCookies,
  setCurrentCharacter,
} from './utils/helpers.ts'

test.describe('Dashboard - Authentificated User', () => {
  test('dashboard index is loading', async ({ page, context }) => {
    const user = await createTestUser(context)
    const cookies = await getTestUserCookies(user.id)

    await context.addCookies(cookies)

    await page.goto('/dashboard')
    await expect(page.getByText(`Bienvenue, Priest John Doe !`)).toBeVisible()

    await deleteTestUser(user.id)
  })
})

test.describe('Dashboard - Unauthorized User/Guest', () => {
  test('guest redirected from /dashboard to /sign-in', async ({ page }) => {
    await page.goto('/dashboard')
    await expect(page).toHaveURL('/sign-in?redirectTo=%2Fdashboard')
  })

  test('user with a character below the minimum rank is redirected from /dashboard to homepage', async ({
    page,
    context,
  }) => {
    const user = await createTestUser(context)
    const cookies = await getTestUserCookies(user.id)
    await context.addCookies(cookies)

    await setCurrentCharacter(context, 2)

    await page.goto('/dashboard')
    await expect(page).toHaveURL('/')

    await deleteTestUser(user.id)
  })
})
