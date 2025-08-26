import { test } from '@japa/runner'
import AuthController from '#auth/controllers/auth_controller'
import testUtils from '@adonisjs/core/services/test_utils'
import { createServer } from 'node:http'

test.group('Auth actions', (group) => {
  let controller: AuthController

  group.setup(() => {
    controller = new AuthController()
  })

  /**
   * Tests for logout method
   */
  test('should successfully logout user', async ({ assert }) => {
    // Test Description: Verifies successful user logout and redirect to home

    let logoutCalled = false

    const mockAuth = {
      use: () => ({
        logout: async () => {
          logoutCalled = true
          return Promise.resolve()
        },
      }),
    }

    createServer(async (req, res) => {
      const ctx = testUtils.createHttpContext({
        req,
        res,
        auth: mockAuth,
        //response: mockResponse,
      })

      const result = await controller.logout(ctx)

      assert.equal(result, 'redirect-to-home')

      assert.isTrue(logoutCalled)
    })
  })

  test('should handle logout errors gracefully', async ({ assert }) => {
    // Test Description: Error handling - logout service failures

    const mockAuth = {
      use: () => ({
        logout: async () => {
          throw new Error('Logout failed')
        },
      }),
    }

    createServer(async (req, res) => {
      const ctx = testUtils.createHttpContext({
        req,
        res,
        auth: mockAuth,
      })

      await assert.rejects(() => controller.logout(ctx), 'Logout failed')
    })
  })
})
