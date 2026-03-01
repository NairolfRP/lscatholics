import { test } from '@japa/runner'
import nock from 'nock'
import fleecaConfig from '#config/fleeca'
import sinon from 'sinon'
import encryption from '@adonisjs/core/services/encryption'
import { DonateService } from '#donate/services/donate_service'

test.group('Api payment fleeca callback', (group) => {
  let fleecaBaseUrl: string

  group.setup(async () => {
    fleecaBaseUrl =
      fleecaConfig.server === 'fr' ? 'https://fleeca.gta.world' : 'https://banking.gta.world'

    if (!nock.isActive()) {
      nock.activate()
    }
  })

  group.teardown(() => {
    nock.cleanAll()
    nock.restore()
  })

  group.each.teardown(() => {
    sinon.restore()
  })

  test('should handle successful donation payment', async ({ client, assert }) => {
    const token = 'valid-token'
    const mockValidationResponse = {
      token,
      auth_key: 'test-auth-key',
      message: 'payment_successful',
      payment: 1000,
      routing_from: 'user',
      routing_to: 'merchant',
      sandbox: false,
      token_expired: false,
      token_created_at: new Date().toISOString(),
    }
    const mockSessionData = {
      token,
      sessionId: 'test-session',
      source: 'donation',
      amount: 1000,
      metadata: {
        firstname: 'John',
        lastname: 'Doe',
        anonymous: false,
      },
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 60 * 60_000),
    }

    sinon.stub(encryption, 'decrypt').returns(JSON.stringify(mockSessionData))

    sinon.stub(DonateService.prototype, 'sendPrivateDonateNotification').resolves()
    sinon.stub(DonateService.prototype, 'sendPublicDonateNotification').resolves()

    nock(fleecaBaseUrl)
      .post(`/gateway_token/${token}`, { token })
      .reply(200, mockValidationResponse)

    const response = await client
      .get(`/api/payment/fleeca/callback/${token}`)
      .withInertia()
      .withSession({
        payment_data: mockSessionData,
      })

    response.assertStatus(200)
    response.assertInertiaComponent('payment-callback')
    response.assertInertiaPropsContains({
      title: 'Donation réussie !',
      amount: 1000,
      source: 'donation',
    })
    assert.isTrue(nock.isDone())
  })

  test('should handle payment processing failure', async ({ client }) => {
    const token = 'invalid-token'

    const response = await client.get(`/api/payment/fleeca/callback/${token}`).withInertia()

    response.assertStatus(200)
    response.assertInertiaComponent('payment-callback')
    response.assertInertiaPropsContains({
      success: false,
      error: "Le paiement n'a pas pu être vérifié",
      title: 'Erreur de paiement',
    })
  })

  test('should return error page for unknown payment source', async ({ client, assert }) => {
    const token = 'valid-token'
    const mockValidationResponse = {
      token,
      auth_key: 'test-auth-key',
      message: 'payment_successful',
      payment: 1000,
      routing_from: 'user',
      routing_to: 'merchant',
      sandbox: false,
      token_expired: false,
      token_created_at: new Date().toISOString(),
    }
    const mockSessionData = {
      token,
      sessionId: 'test-session',
      source: 'unknown-source',
      amount: 1000,
      metadata: {},
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 60 * 60_000),
    }

    sinon.stub(encryption, 'decrypt').returns(JSON.stringify(mockSessionData))

    nock(fleecaBaseUrl)
      .post(`/gateway_token/${token}`, { token })
      .reply(200, mockValidationResponse)

    const response = await client
      .get(`/api/payment/fleeca/callback/${token}`)
      .withInertia()
      .withSession({
        payment_data: mockSessionData,
      })

    response.assertStatus(200)
    response
      .assertInertiaComponent('payment-callback')
      .assertInertiaPropsContains({ success: false, title: 'Erreur de paiement' })
    assert.isTrue(nock.isDone())
  })
})
