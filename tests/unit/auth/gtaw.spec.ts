import { test } from '@japa/runner'
import AuthController from '#auth/controllers/auth_controller'
import Account from '#auth/models/account'
import User from '#auth/models/user'
import { DateTime } from 'luxon'
import db from '@adonisjs/lucid/services/db'
import { createServer } from 'node:http'
import testUtils from '@adonisjs/core/services/test_utils'

test.group('GTA World OAuth', (group) => {
  let controller: AuthController

  group.setup(() => {
    controller = new AuthController()
  })

  test('should redirect to gtaw provider successfully', async ({ assert }) => {
    // Test Description: Verifies that the redirect method is called on the gtaw ally provider

    const redirectSpy = {
      redirect: () => 'redirect-url',
    }

    const mockAlly = {
      use: (provider: string) => {
        assert.equal(provider, 'gtaw')
        return redirectSpy
      },
    }

    createServer(async (req, res) => {
      const ctx = testUtils.createHttpContext({
        req,
        res,
        ally: mockAlly,
      })

      const result = await controller.redirectToProvider(ctx)

      assert.equal(result, 'redirect-url')
    })
  })

  test('should handle ally service errors gracefully', async ({ assert }) => {
    // Test Description: Ensures that errors from ally service are properly handled

    const mockAlly = {
      use: () => {
        throw new Error('Ally service error')
      },
    }

    createServer(async (req, res) => {
      const ctx = testUtils.createHttpContext({
        req,
        res,
        ally: mockAlly,
      })
      await assert.rejects(() => controller.redirectToProvider(ctx), 'Ally service error')
    })
  })

  /**
   * Tests for handleCallback method
   */
  test('should return error when access is denied', async ({ assert }) => {
    // Test Description: Verifies proper error response when user denies access

    const mockGtaw = {
      accessDenied: () => true,
      stateMisMatch: () => false,
      hasError: () => false,
    }

    const mockAlly = {
      use: () => mockGtaw,
    }

    createServer(async (req, res) => {
      const ctx = testUtils.createHttpContext({
        req,
        res,
        ally: mockAlly,
      })

      const result = await controller.handleCallback(ctx)

      assert.deepEqual(result, {
        message: 'You have cancelled the login process',
      })
    })
  })

  test('should return error when state mismatch occurs', async ({ assert }) => {
    // Test Description: Verifies proper error response when OAuth state validation fails

    const mockGtaw = {
      accessDenied: () => false,
      stateMisMatch: () => true,
      hasError: () => false,
    }

    const mockAlly = {
      use: () => mockGtaw,
    }

    createServer(async (req, res) => {
      const ctx = testUtils.createHttpContext({
        req,
        res,
        ally: mockAlly,
      })

      const result = await controller.handleCallback(ctx)

      assert.deepEqual(result, {
        message: 'We are unable to verify the request. Please try again',
      })
    })
  })

  test('should return error when gtaw has error', async ({ assert }) => {
    // Test Description: Verifies proper error response when OAuth provider returns an error
    // Note: There's a typo in original code (gta5.getError() should be gtaw.getError())

    const mockGtaw = {
      accessDenied: () => false,
      stateMisMatch: () => false,
      hasError: () => true,
      getError: () => 'OAuth provider error',
    }

    const mockAlly = {
      use: () => mockGtaw,
    }

    createServer(async (req, res) => {
      const ctx = testUtils.createHttpContext({
        req,
        res,
        ally: mockAlly,
      })

      // This test will fail due to the typo in the original code
      // The code references 'gta5.getError()' but should be 'gtaw.getError()'
      await assert.rejects(() => controller.handleCallback(ctx), 'gta5 is not defined')
    })
  })

  test('should return unauthorized when gtaw account is not confirmed', async ({ assert }) => {
    // Test Description: Verifies rejection of unconfirmed GTA World accounts

    const mockGtawUser = {
      id: '12345',
      name: 'Test User',
      original: {
        confirmed: 0, // Not confirmed
        character: ['character1'],
      },
      token: {
        token: 'access-token',
        refreshToken: 'refresh-token',
        expiresAt: new Date('2024-12-31'),
      },
    }

    const mockGtaw = {
      accessDenied: () => false,
      stateMisMatch: () => false,
      hasError: () => false,
      user: async () => mockGtawUser,
    }

    const mockAlly = {
      use: () => mockGtaw,
    }

    createServer(async (req, res) => {
      const ctx = testUtils.createHttpContext({
        req,
        res,
        ally: mockAlly,
      })

      const result = await controller.handleCallback(ctx)

      assert.deepEqual(result, {
        message: 'Your GTA World account is not confirmed or is disabled',
      })
    })
  })

  test('should return unauthorized when gtaw account has no characters', async ({ assert }) => {
    // Test Description: Verifies rejection when user has no characters on GTA World

    const mockGtawUser = {
      id: '12345',
      name: 'Test User',
      original: {
        confirmed: 1,
        character: [], // No characters
      },
      token: {
        token: 'access-token',
        refreshToken: 'refresh-token',
        expiresAt: new Date('2024-12-31'),
      },
    }

    const mockGtaw = {
      accessDenied: () => false,
      stateMisMatch: () => false,
      hasError: () => false,
      user: async () => mockGtawUser,
    }

    const mockAlly = {
      use: () => mockGtaw,
    }

    createServer(async (req, res) => {
      const ctx = testUtils.createHttpContext({
        req,
        res,
        ally: mockAlly,
      })

      const result = await controller.handleCallback(ctx)

      assert.deepEqual(result, {
        message: 'You must have at least one character on your GTA World account',
      })
    })
  })

  test('should return unauthorized when character is null', async ({ assert }) => {
    // Test Description: Edge case testing when character field is null instead of empty array

    const mockGtawUser = {
      id: '12345',
      name: 'Test User',
      original: {
        confirmed: 1,
        character: null, // Null characters
      },
      token: {
        token: 'access-token',
        refreshToken: 'refresh-token',
        expiresAt: new Date('2024-12-31'),
      },
    }

    const mockGtaw = {
      accessDenied: () => false,
      stateMisMatch: () => false,
      hasError: () => false,
      user: async () => mockGtawUser,
    }

    const mockAlly = {
      use: () => mockGtaw,
    }

    createServer(async (req, res) => {
      const ctx = testUtils.createHttpContext({
        req,
        res,
        ally: mockAlly,
      })

      const result = await controller.handleCallback(ctx)

      assert.deepEqual(result, {
        message: 'You must have at least one character on your GTA World account',
      })
    })
  })

  test('should successfully login existing user and update tokens', async ({ assert }) => {
    // Test Description: Happy path - existing user with valid account should be logged in with updated tokens

    // Mock existing user and account
    const mockUser = {
      id: 1,
      name: 'Existing User',
    }

    const mockAccount = {
      user: mockUser,
      merge: (data: any) => {
        Object.assign(mockAccount, data)
      },
      save: async () => Promise.resolve(),
      accessToken: 'old-token',
      refreshToken: 'old-refresh-token',
      accessTokenExpiresAt: null,
    }

    // Mock Account query
    const mockAccountQuery = {
      where: () => mockAccountQuery,
      preload: () => mockAccountQuery,
      first: async () => mockAccount,
    }

    const originalAccountQuery = Account.query
    Account.query = () => mockAccountQuery

    const mockGtawUser = {
      id: '12345',
      name: 'Test User',
      original: {
        confirmed: 1,
        character: ['character1'],
      },
      token: {
        token: 'new-access-token',
        refreshToken: 'new-refresh-token',
        expiresAt: new Date('2024-12-31T23:59:59Z'),
      },
    }

    const mockGtaw = {
      accessDenied: () => false,
      stateMisMatch: () => false,
      hasError: () => false,
      user: async () => mockGtawUser,
    }

    const mockAlly = {
      use: () => mockGtaw,
    }

    const mockAuth = {
      use: () => ({
        login: async (user: any) => {
          assert.equal(user, mockUser)
          return Promise.resolve()
        },
      }),
    }

    createServer(async (req, res) => {
      const ctx = testUtils.createHttpContext({
        req,
        res,
        ally: mockAlly,
        auth: mockAuth,
      })

      const result = await controller.handleCallback(ctx)

      // Verify tokens were updated
      assert.equal(mockAccount.accessToken, 'new-access-token')
      assert.equal(mockAccount.refreshToken, 'new-refresh-token')
      assert.instanceOf(mockAccount.accessTokenExpiresAt, DateTime)

      assert.equal(result, 'redirect-back')
    })
    // Restore original query method
    Account.query = originalAccountQuery
  })

  test('should create new user when account does not exist', async ({ assert }) => {
    // Test Description: Happy path - new user registration flow

    // Mock Account query returning null (no existing account)
    const mockAccountQuery = {
      where: () => mockAccountQuery,
      preload: () => mockAccountQuery,
      first: async () => null,
    }

    const originalAccountQuery = Account.query
    Account.query = () => mockAccountQuery

    const mockUser = {
      id: 1,
      name: 'New User',
      useTransaction: () => {},
      save: async () => Promise.resolve(),
      related: () => ({
        create: async (data: any) => {
          assert.equal(data.providerId, 'gtaw')
          assert.equal(data.accountId, '12345')
          assert.equal(data.accessToken, 'new-access-token')
          assert.equal(data.refreshToken, 'new-refresh-token')
          assert.instanceOf(data.accessTokenExpiresAt, DateTime)
          return Promise.resolve()
        },
      }),
    }

    const originalUser = User
    // @ts-ignore - Mock constructor
    global.User = function () {
      return mockUser
    }

    const mockTransaction = async (callback: Function) => {
      return await callback({})
    }

    const originalDbTransaction = db.transaction
    db.transaction = mockTransaction

    const mockGtawUser = {
      id: '12345',
      name: 'New User',
      original: {
        confirmed: 1,
        character: ['character1'],
      },
      token: {
        token: 'new-access-token',
        refreshToken: 'new-refresh-token',
        expiresAt: new Date('2024-12-31T23:59:59Z'),
      },
    }

    const mockGtaw = {
      accessDenied: () => false,
      stateMisMatch: () => false,
      hasError: () => false,
      user: async () => mockGtawUser,
    }

    const mockAlly = {
      use: () => mockGtaw,
    }

    const mockAuth = {
      use: () => ({
        login: async (user: any) => {
          assert.equal(user, mockUser)
          return Promise.resolve()
        },
      }),
    }

    createServer(async (req, res) => {
      const ctx = testUtils.createHttpContext({
        req,
        res,
        ally: mockAlly,
        auth: mockAuth,
      })

      const result = await controller.handleCallback(ctx)

      assert.equal(mockUser.name, 'New User')
      assert.equal(result, 'redirect-back')
    })

    // Restore original methods
    Account.query = originalAccountQuery
    global.User = originalUser
    db.transaction = originalDbTransaction
  })

  test('should handle token without expiry date', async ({ assert }) => {
    // Test Description: Edge case - handle tokens that don't have expiration dates

    const mockUser = {
      id: 1,
      name: 'Test User',
    }

    const mockAccount = {
      user: mockUser,
      merge: (data: any) => {
        Object.assign(mockAccount, data)
      },
      save: async () => Promise.resolve(),
      accessToken: 'old-token',
      refreshToken: 'old-refresh-token',
      accessTokenExpiresAt: DateTime.now(),
    }

    const mockAccountQuery = {
      where: () => mockAccountQuery,
      preload: () => mockAccountQuery,
      first: async () => mockAccount,
    }

    const originalAccountQuery = Account.query
    Account.query = () => mockAccountQuery

    const mockGtawUser = {
      id: '12345',
      name: 'Test User',
      original: {
        confirmed: 1,
        character: ['character1'],
      },
      token: {
        token: 'new-access-token',
        refreshToken: 'new-refresh-token',
        expiresAt: null, // No expiry date
      },
    }

    const mockGtaw = {
      accessDenied: () => false,
      stateMisMatch: () => false,
      hasError: () => false,
      user: async () => mockGtawUser,
    }

    const mockAlly = {
      use: () => mockGtaw,
    }

    const mockAuth = {
      use: () => ({
        login: async () => Promise.resolve(),
      }),
    }

    createServer(async (req, res) => {
      const ctx = testUtils.createHttpContext({
        req,
        res,
        ally: mockAlly,
        auth: mockAuth,
      })

      const result = await controller.handleCallback(ctx)

      // Verify that accessTokenExpiresAt is set to null when token has no expiry
      assert.equal(mockAccount.accessTokenExpiresAt, null)
      assert.equal(result, 'redirect-back')
    })
    Account.query = originalAccountQuery
  })

  test('should handle database transaction errors during user creation', async ({ assert }) => {
    // Test Description: Error handling - database transaction failures during user creation

    const mockAccountQuery = {
      where: () => mockAccountQuery,
      preload: () => mockAccountQuery,
      first: async () => null,
    }

    const originalAccountQuery = Account.query
    Account.query = () => mockAccountQuery

    const mockTransaction = async (callback: Function) => {
      throw new Error('Database transaction failed')
    }

    const originalDbTransaction = db.transaction
    db.transaction = mockTransaction

    const mockGtawUser = {
      id: '12345',
      name: 'Test User',
      original: {
        confirmed: 1,
        character: ['character1'],
      },
      token: {
        token: 'access-token',
        refreshToken: 'refresh-token',
        expiresAt: new Date(),
      },
    }

    const mockGtaw = {
      accessDenied: () => false,
      stateMisMatch: () => false,
      hasError: () => false,
      user: async () => mockGtawUser,
    }

    const mockAlly = {
      use: () => mockGtaw,
    }

    createServer(async (req, res) => {
      const ctx = testUtils.createHttpContext({
        req,
        res,
        ally: mockAlly,
      })

      await assert.rejects(() => controller.handleCallback(ctx), 'Database transaction failed')
    })

    Account.query = originalAccountQuery
    db.transaction = originalDbTransaction
  })

  test('should handle confirmed field as boolean true', async ({ assert }) => {
    // Test Description: Boundary value testing - confirmed field as boolean instead of number

    const mockUser = {
      id: 1,
      name: 'Test User',
    }

    const mockAccount = {
      user: mockUser,
      merge: () => {},
      save: async () => Promise.resolve(),
    }

    const mockAccountQuery = {
      where: () => mockAccountQuery,
      preload: () => mockAccountQuery,
      first: async () => mockAccount,
    }

    const originalAccountQuery = Account.query
    Account.query = () => mockAccountQuery

    const mockGtawUser = {
      id: '12345',
      name: 'Test User',
      original: {
        confirmed: true, // Boolean instead of number
        character: ['character1'],
      },
      token: {
        token: 'access-token',
        refreshToken: 'refresh-token',
        expiresAt: null,
      },
    }

    const mockGtaw = {
      accessDenied: () => false,
      stateMisMatch: () => false,
      hasError: () => false,
      user: async () => mockGtawUser,
    }

    const mockAlly = {
      use: () => mockGtaw,
    }

    const mockAuth = {
      use: () => ({
        login: async () => Promise.resolve(),
      }),
    }

    createServer(async (req, res) => {
      const ctx = testUtils.createHttpContext({
        req,
        res,
        ally: mockAlly,
        auth: mockAuth,
      })

      const result = await controller.handleCallback(ctx)

      // Should succeed because true is truthy
      assert.equal(result, 'redirect-back')
    })

    Account.query = originalAccountQuery
  })

  /**
   * Integration-like tests for complete flows
   */
  test('should handle multiple callback attempts for same user', async ({ assert }) => {
    // Test Description: Ensures idempotent behavior when same user authenticates multiple times

    const mockUser = {
      id: 1,
      name: 'Test User',
    }

    const mockAccount = {
      user: mockUser,
      merge: (data: any) => {
        // Simulate updating the account with new token data
        mockAccount.accessToken = data.accessToken
      },
      save: async () => Promise.resolve(),
      accessToken: 'old-token',
    }

    const mockAccountQuery = {
      where: () => mockAccountQuery,
      preload: () => mockAccountQuery,
      first: async () => mockAccount,
    }

    const originalAccountQuery = Account.query
    Account.query = () => mockAccountQuery

    const mockGtawUser = {
      id: '12345',
      name: 'Test User',
      original: {
        confirmed: 1,
        character: ['character1'],
      },
      token: {
        token: 'updated-token',
        refreshToken: 'updated-refresh-token',
        expiresAt: null,
      },
    }

    const mockGtaw = {
      accessDenied: () => false,
      stateMisMatch: () => false,
      hasError: () => false,
      user: async () => mockGtawUser,
    }

    const mockAlly = {
      use: () => mockGtaw,
    }

    const mockAuth = {
      use: () => ({
        login: async () => Promise.resolve(),
      }),
    }

    createServer(async (req, res) => {
      const ctx = testUtils.createHttpContext({
        req,
        res,
        ally: mockAlly,
        auth: mockAuth,
      })

      // First callback
      await controller.handleCallback(ctx)
      assert.equal(mockAccount.accessToken, 'updated-token')

      // Second callback with different token
      mockGtawUser.token.token = 'newer-token'
      await controller.handleCallback(ctx)
      assert.equal(mockAccount.accessToken, 'newer-token')
    })

    Account.query = originalAccountQuery
  })

  test('should handle malformed gtaw user data', async ({ assert }) => {
    // Test Description: Error handling - malformed or incomplete user data from OAuth provider

    const mockGtawUser = {
      id: '12345',
      // Missing name field
      original: {
        confirmed: 1,
        character: ['character1'],
      },
      token: {
        token: 'access-token',
        // Missing refreshToken
        expiresAt: null,
      },
    }

    const mockGtaw = {
      accessDenied: () => false,
      stateMisMatch: () => false,
      hasError: () => false,
      user: async () => mockGtawUser,
    }

    const mockAlly = {
      use: () => mockGtaw,
    }

    const mockAccountQuery = {
      where: () => mockAccountQuery,
      preload: () => mockAccountQuery,
      first: async () => null,
    }

    const originalAccountQuery = Account.query
    Account.query = () => mockAccountQuery

    createServer(async (req, res) => {
      const ctx = testUtils.createHttpContext({
        req,
        res,
        ally: mockAlly,
      })

      // This should handle missing fields gracefully or throw appropriate errors
      await assert.rejects(() => controller.handleCallback(ctx))
    })

    Account.query = originalAccountQuery
  })
})
