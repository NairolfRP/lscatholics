import { test } from '@japa/runner'
import { PaymentService } from '#core/services/payment_service'
import hash from '@adonisjs/core/services/hash'
import fleecaConfig from '#config/fleeca'
import nock from 'nock'
import sinon from 'sinon'
import encryption from '@adonisjs/core/services/encryption'

test.group('Payment Service', (group) => {
  let paymentService: PaymentService
  let mockSession: any
  let fleecaBaseUrl: string
  let originalServer: (typeof fleecaConfig)['server']

  group.setup(() => {
    paymentService = new PaymentService()

    originalServer = fleecaConfig.server
    fleecaBaseUrl =
      fleecaConfig.server === 'fr' ? 'https://fleeca.gta.world' : 'https://banking.gta.world'

    mockSession = {
      put: sinon.fake(),
      get: sinon.stub(),
      forget: sinon.fake(),
    }

    if (!nock.isActive()) {
      nock.activate()
    }
  })

  group.teardown(() => {
    nock.cleanAll()
    nock.restore()
    sinon.restore()
  })

  group.each.teardown(() => {
    sinon.restore()
  })

  test('should generate valid payment URL and session', async ({ assert }) => {
    const source = 'donation'
    const amount = 1000
    const metadata = { firstname: 'John', lastname: 'Doe' }
    const mockSessionId = 'mocked-session-id'
    const mockEncryptedData = 'encrypted-session-data'

    hash.fake()

    sinon.stub(hash, 'make').resolves(mockSessionId)
    sinon.stub(encryption, 'encrypt').returns(mockEncryptedData)

    const result = await paymentService.generatePaymentUrl(source, amount, metadata, mockSession)

    assert.equal(result.sessionId, mockSessionId)
    assert.equal(
      result.paymentUrl,
      `${fleecaBaseUrl}/gateway/${fleecaConfig.authKey}/0/${amount.toString()}`
    )
    assert.isTrue(mockSession.put.calledWith('payment_data', mockEncryptedData))

    hash.restore()
  })

  test('should throw error for invalid amount', async ({ assert }) => {
    const source = 'donation'
    const invalidAmounts = [0, -100, null, undefined]

    hash.fake()

    for (const amount of invalidAmounts) {
      await assert.rejects(
        () => paymentService.generatePaymentUrl(source, amount as any, {}, mockSession),
        'Failed to generate payment URL'
      )
    }

    hash.restore()
  })

  test('should throw error for empty source', async ({ assert }) => {
    const invalidSources = ['', '   ', null, undefined]
    const amount = 1000

    hash.fake()

    for (const source of invalidSources) {
      await assert.rejects(
        () => paymentService.generatePaymentUrl(source as any, amount, {}, mockSession),
        'Failed to generate payment URL'
      )
    }

    hash.restore()
  })

  test('should use correct base URL for different servers', async ({ assert }) => {
    hash.fake()

    fleecaConfig.server = 'fr'
    let result = await paymentService.generatePaymentUrl('donation', 1000, {}, mockSession)
    assert.isTrue(result.paymentUrl.includes('https://fleeca.gta.world'))

    fleecaConfig.server = 'en'
    result = await paymentService.generatePaymentUrl('donation', 1000, {}, mockSession)
    assert.isTrue(result.paymentUrl.includes('https://banking.gta.world'))

    fleecaConfig.server = originalServer

    hash.restore()
  })

  test('should process successful payment', async ({ assert }) => {
    const token = 'valid-token'
    const mockSessionData = {
      sessionId: 'test-session',
      source: 'donation',
      amount: 1000,
      metadata: { firstname: 'John' },
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 3600000), // 1 hour from now
    }
    const mockValidationResponse = {
      token: 'valid-token',
      auth_key: 'test-auth-key',
      message: 'payment_successful',
      payment: 1000,
      routing_from: 'user',
      routing_to: 'merchant',
      sandbox: false,
      token_expired: false,
      token_created_at: new Date().toISOString(),
    }

    mockSession.get.returns('encrypted-session-data')
    sinon.stub(encryption, 'decrypt').returns(JSON.stringify(mockSessionData))

    nock(fleecaBaseUrl)
      .post(`/gateway_token/${token}`, { token })
      .reply(200, mockValidationResponse)

    const result = await paymentService.processPaymentCallback(token, mockSession)

    assert.isTrue(result.success)
    assert.equal(result.sessionData.amount, 1000)
    assert.equal(result.transactionData?.message, 'payment_successful')
    assert.isTrue(mockSession.forget.calledWith('payment_data'))
    assert.isTrue(nock.isDone())
  })

  test('should fail when no session data found', async ({ assert }) => {
    const token = 'valid-token'
    mockSession.get.returns(null)

    const result = await paymentService.processPaymentCallback(token, mockSession)

    assert.isFalse(result.success)
    assert.equal(result.sessionData.source, 'unknown')
  })

  test('should fail when session expired', async ({ assert }) => {
    const token = 'valid-token'
    const expiredSessionData = {
      sessionId: 'test-session',
      source: 'donation',
      amount: 1000,
      metadata: {},
      createdAt: new Date(),
      expiresAt: new Date(Date.now() - 1000), // Expired 1 second ago
    }

    mockSession.get.returns('encrypted-session-data')
    sinon.stub(encryption, 'decrypt').returns(JSON.stringify(expiredSessionData))

    const result = await paymentService.processPaymentCallback(token, mockSession)

    assert.isFalse(result.success)
    assert.isTrue(mockSession.forget.calledWith('payment_data'))
  })

  test('should fail when payment amount mismatch', async ({ assert }) => {
    const token = 'valid-token'
    const mockSessionData = {
      sessionId: 'test-session',
      source: 'donation',
      amount: 1000,
      metadata: {},
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 3600000),
    }
    const mockValidationResponse = {
      token: 'valid-token',
      auth_key: 'test-auth-key',
      message: 'payment_successful',
      payment: 2000, // Different amount
      routing_from: 'user',
      routing_to: 'merchant',
      sandbox: false,
      token_expired: false,
      token_created_at: new Date().toISOString(),
    }

    mockSession.get.returns('encrypted-session-data')
    sinon.stub(encryption, 'decrypt').returns(JSON.stringify(mockSessionData))

    nock(fleecaBaseUrl).post(`/gateway_token/${token}`).reply(200, mockValidationResponse)

    const result = await paymentService.processPaymentCallback(token, mockSession)

    assert.isFalse(result.success)
    assert.isTrue(nock.isDone())
  })

  test('should fail when invalid auth key', async ({ assert }) => {
    const token = 'valid-token'
    const mockSessionData = {
      sessionId: 'test-session',
      source: 'donation',
      amount: 1000,
      metadata: {},
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 3600000),
    }
    const mockValidationResponse = {
      token: 'valid-token',
      auth_key: 'wrong-auth-key', // Invalid auth key
      message: 'payment_successful',
      payment: 1000,
      routing_from: 'user',
      routing_to: 'merchant',
      sandbox: false,
      token_expired: false,
      token_created_at: new Date().toISOString(),
    }

    mockSession.get.returns('encrypted-session-data')
    sinon.stub(encryption, 'decrypt').returns(JSON.stringify(mockSessionData))

    nock(fleecaBaseUrl).post(`/gateway_token/${token}`).reply(200, mockValidationResponse)

    const result = await paymentService.processPaymentCallback(token, mockSession)

    assert.isFalse(result.success)
    assert.isTrue(nock.isDone())
  })

  test('should fail when token is expired', async ({ assert }) => {
    const token = 'expired-token'
    const mockSessionData = {
      sessionId: 'test-session',
      source: 'donation',
      amount: 1000,
      metadata: {},
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 3600000),
    }
    const mockValidationResponse = {
      token: 'expired-token',
      auth_key: 'test-auth-key',
      message: 'payment_successful',
      payment: 1000,
      routing_from: 'user',
      routing_to: 'merchant',
      sandbox: false,
      token_expired: true, // Token is expired
      token_created_at: new Date().toISOString(),
    }

    mockSession.get.returns('encrypted-session-data')
    sinon.stub(encryption, 'decrypt').returns(JSON.stringify(mockSessionData))

    nock(fleecaBaseUrl).post(`/gateway_token/${token}`).reply(200, mockValidationResponse)

    const result = await paymentService.processPaymentCallback(token, mockSession)

    assert.isFalse(result.success)
    assert.isTrue(nock.isDone())
  })

  test('should handle API validation failure', async ({ assert }) => {
    const token = 'valid-token'
    const mockSessionData = {
      sessionId: 'test-session',
      source: 'donation',
      amount: 1000,
      metadata: {},
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 3600000),
    }

    mockSession.get.returns('encrypted-session-data')
    sinon.stub(encryption, 'decrypt').returns(JSON.stringify(mockSessionData))

    nock(fleecaBaseUrl).post(`/gateway_token/${token}`).reply(404, { error: 'Token not found' })

    const result = await paymentService.processPaymentCallback(token, mockSession)

    assert.isFalse(result.success)
    assert.isTrue(nock.isDone())
  })

  test('should handle network timeout', async ({ assert }) => {
    const token = 'valid-token'
    const mockSessionData = {
      sessionId: 'test-session',
      source: 'donation',
      amount: 1000,
      metadata: {},
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 3600000),
    }

    mockSession.get.returns('encrypted-session-data')
    sinon.stub(encryption, 'decrypt').returns(JSON.stringify(mockSessionData))

    nock(fleecaBaseUrl).post(`/gateway_token/${token}`).replyWithError('Network timeout')

    const result = await paymentService.processPaymentCallback(token, mockSession)

    assert.isFalse(result.success)
    assert.isTrue(nock.isDone())
  })

  test('boundary value analysis for amounts', async ({ assert }) => {
    hash.fake()

    const result1 = await paymentService.generatePaymentUrl('donation', 1, {}, mockSession)
    assert.strictEqual(result1.paymentUrl, `${fleecaBaseUrl}/gateway/${fleecaConfig.authKey}/0/1`)

    const result2 = await paymentService.generatePaymentUrl('donation', 999999999, {}, mockSession)
    assert.strictEqual(
      result2.paymentUrl,
      `${fleecaBaseUrl}/gateway/${fleecaConfig.authKey}/0/999999999`
    )

    hash.restore()
  })
})
