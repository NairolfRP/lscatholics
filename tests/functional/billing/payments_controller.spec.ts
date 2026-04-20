import { test } from '@japa/runner'
import sinon from 'sinon'
import nock from 'nock'
import { createHmac } from 'node:crypto'
import { DateTime } from 'luxon'
import testUtils from '@adonisjs/core/services/test_utils'
import fleecaConfig from '#config/fleeca'
import PendingPayment from '#billing/models/pending_payment'
import { PaymentService } from '#billing/services/payment_service'

const FLEECA_BASE_URL = 'https://fleeca.gta.world'
const VALID_PAYMENT_ID = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
const VALID_AMOUNT = 1_000
const VALID_SOURCE = 'donation'
const VALID_MODE: 'live' | 'sandbox' = fleecaConfig.mode === 1 ? 'live' : 'sandbox'

function sign(rawBody: string): string {
  return `sha256=${createHmac('sha256', fleecaConfig.apiKey.release()).update(rawBody).digest('hex')}`
}

function makeWebhookBody(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    payment_id: VALID_PAYMENT_ID,
    payment_url: `${FLEECA_BASE_URL}/gateway/${VALID_PAYMENT_ID}`,
    mode: VALID_MODE,
    amount: VALID_AMOUNT,
    payer_routing: '020001001',
    status: 'payment_successful',
    created_at: new Date().toISOString(),
    paid_at: new Date().toISOString(),
    ...overrides,
  }
}

async function createPendingPayment(overrides: Partial<{ expiresAt: DateTime }> = {}) {
  return PendingPayment.create({
    id: VALID_PAYMENT_ID,
    source: VALID_SOURCE,
    amount: VALID_AMOUNT,
    mode: fleecaConfig.mode,
    metadata: { firstname: 'John', lastname: 'Doe', anonymous: false },
    expiresAt: overrides.expiresAt ?? DateTime.now().plus({ minutes: 30 }),
  })
}

function mockFleecaGetPayment(status: 'payment_successful' | 'payment_failed' | 'pending') {
  nock(FLEECA_BASE_URL)
    .get(`/api/v2/payments/${VALID_PAYMENT_ID}`)
    .reply(200, {
      success: true,
      data: {
        payment_id: VALID_PAYMENT_ID,
        status,
        amount: VALID_AMOUNT,
        mode: VALID_MODE,
        merchant_id: 1,
        description: null,
        payer_routing: '020001001',
        paid_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    })
}

test.group('POST /api/payment/fleeca/webhook', (group) => {
  group.setup(() => {
    if (!nock.isActive()) nock.activate()
  })
  group.each.setup(() => testUtils.db().wrapInGlobalTransaction())
  group.each.teardown(() => {
    sinon.restore()
    nock.cleanAll()
  })
  group.teardown(() => nock.restore())

  test('returns 403 when X-Fleeca-Signature header is absent', async ({ client }) => {
    const response = await client
      .post('/api/payment/fleeca/webhook')
      .json(makeWebhookBody())
      .header('Content-Type', 'application/json')
      .send()

    response.assertStatus(403)
  })

  test('returns 403 when the signature is a forgery', async ({ client }) => {
    /**
     * No stubs — the real HMAC check runs through FleecaClient.
     * An invalid signature must be rejected before any DB access.
     */
    const body = makeWebhookBody()

    const response = await client
      .post('/api/payment/fleeca/webhook')
      .withCsrfToken()
      .json(body)
      .header('Content-Type', 'application/json')
      .header(
        'X-Fleeca-Signature',
        'sha256=cafebabe00000000000000000000000000000000000000000000000000000000'
      )
      .send()

    response.assertStatus(403)
  })

  test('returns 403 when the signature is computed with the wrong key', async ({ client }) => {
    const body = makeWebhookBody()
    const wrongSig = `sha256=${createHmac('sha256', 'wrong-secret').update(JSON.stringify(body)).digest('hex')}`

    const response = await client
      .post('/api/payment/fleeca/webhook')
      .withCsrfToken()
      .json(body)
      .header('Content-Type', 'application/json')
      .header('X-Fleeca-Signature', wrongSig)

    response.assertStatus(403)
  })

  test('returns 200 and calls processWebhook for a valid signed request', async ({ client }) => {
    /**
     * Stub processWebhook so we validate the controller routing only.
     * The business logic of processWebhook is covered in unit tests.
     */
    const stub = sinon.stub(PaymentService.prototype, 'processWebhook').resolves()
    const body = makeWebhookBody()

    const response = await client
      .post('/api/payment/fleeca/webhook')
      .withCsrfToken()
      .json(body)
      .header('Content-Type', 'application/json')
      .header('X-Fleeca-Signature', sign(JSON.stringify(body)))
      .send()

    response.assertStatus(200)
    sinon.assert.calledOnce(stub)
  })

  test('returns 200 even when processWebhook throws (prevents Fleeca retry loop)', async ({
    client,
  }) => {
    sinon.stub(PaymentService.prototype, 'processWebhook').rejects(new Error('Handler crashed'))
    const body = makeWebhookBody()

    const response = await client
      .post('/api/payment/fleeca/webhook')
      .withCsrfToken()
      .json(body)
      .header('Content-Type', 'application/json')
      .header('X-Fleeca-Signature', sign(JSON.stringify(body)))
      .send()

    response.assertStatus(200)
  })
})

test.group('GET /api/payment/fleeca/callback', (group) => {
  group.setup(() => {
    if (!nock.isActive()) nock.activate()
  })
  group.each.setup(() => testUtils.db().wrapInGlobalTransaction())
  group.each.teardown(() => {
    sinon.restore()
    nock.cleanAll()
  })
  group.teardown(() => nock.restore())

  test('returns error page when payment_id query param is missing', async ({ client }) => {
    const response = await client.get('/api/payment/fleeca/callback').withInertia()

    response.assertStatus(200)
    response.assertInertiaComponent('payment-callback')
    response.assertInertiaPropsContains({ success: false, title: 'Erreur de paiement' })
  })

  test('returns pending page for an in-flight payment', async ({ client }) => {
    await createPendingPayment()

    const response = await client
      .get(`/api/payment/fleeca/callback?payment_id=${VALID_PAYMENT_ID}`)
      .withInertia()

    response.assertStatus(200)
    response.assertInertiaComponent('payment-callback')
    response.assertInertiaPropsContains({
      success: null,
      paymentId: VALID_PAYMENT_ID,
    })
  })

  test('returns success page when Fleeca API confirms payment_successful', async ({
    client,
    assert,
  }) => {
    mockFleecaGetPayment('payment_successful')

    const response = await client
      .get(`/api/payment/fleeca/callback?payment_id=${VALID_PAYMENT_ID}`)
      .withInertia()

    response.assertStatus(200)
    response.assertInertiaComponent('payment-callback')
    response.assertInertiaPropsContains({ success: true })
    assert.isTrue(nock.isDone())
  })

  test('returns failure page when Fleeca API reports payment_failed', async ({
    client,
    assert,
  }) => {
    mockFleecaGetPayment('payment_failed')

    const response = await client
      .get(`/api/payment/fleeca/callback?payment_id=${VALID_PAYMENT_ID}`)
      .withInertia()

    response.assertStatus(200)
    response.assertInertiaComponent('payment-callback')
    response.assertInertiaPropsContains({ success: false, title: 'Paiement refusé' })
    assert.isTrue(nock.isDone())
  })

  test('returns expired page for an expired pending payment', async ({ client }) => {
    await createPendingPayment({ expiresAt: DateTime.now().minus({ seconds: 1 }) })

    const response = await client
      .get(`/api/payment/fleeca/callback?payment_id=${VALID_PAYMENT_ID}`)
      .withInertia()

    response.assertStatus(200)
    response.assertInertiaComponent('payment-callback')
    response.assertInertiaPropsContains({ success: false, title: 'Session expirée' })
  })

  test('returns not_found page for a completely unknown payment_id', async ({ client, assert }) => {
    nock(FLEECA_BASE_URL)
      .get(`/api/v2/payments/${VALID_PAYMENT_ID}`)
      .reply(404, { success: false, message: 'Payment not found' })

    const response = await client
      .get(`/api/payment/fleeca/callback?payment_id=${VALID_PAYMENT_ID}`)
      .withInertia()

    response.assertStatus(200)
    response.assertInertiaComponent('payment-callback')
    response.assertInertiaPropsContains({ success: false, title: 'Paiement introuvable' })
    assert.isTrue(nock.isDone())
  })
})

test.group('GET /api/payment/status/:paymentId', (group) => {
  group.setup(() => {
    if (!nock.isActive()) nock.activate()
  })
  group.each.setup(() => testUtils.db().wrapInGlobalTransaction())
  group.each.teardown(() => {
    sinon.restore()
    nock.cleanAll()
  })
  group.teardown(() => nock.restore())

  test('returns { status: pending } for an in-flight payment', async ({ client }) => {
    await createPendingPayment()

    const response = await client.get(`/api/payment/status/${VALID_PAYMENT_ID}`)

    response.assertStatus(200)
    response.assertBodyContains({ status: 'pending', amount: VALID_AMOUNT })
  })

  test('returns { status: payment_successful } via Fleeca API fallback', async ({
    client,
    assert,
  }) => {
    mockFleecaGetPayment('payment_successful')

    const response = await client.get(`/api/payment/status/${VALID_PAYMENT_ID}`)

    response.assertStatus(200)
    response.assertBodyContains({ status: 'payment_successful', amount: VALID_AMOUNT })
    assert.isTrue(nock.isDone())
  })

  test('returns { status: payment_failed } via Fleeca API fallback', async ({ client, assert }) => {
    mockFleecaGetPayment('payment_failed')

    const response = await client.get(`/api/payment/status/${VALID_PAYMENT_ID}`)

    response.assertStatus(200)
    response.assertBodyContains({ status: 'payment_failed' })
    assert.isTrue(nock.isDone())
  })

  test('returns 404 for a completely unknown payment_id', async ({ client, assert }) => {
    nock(FLEECA_BASE_URL).get(`/api/v2/payments/${VALID_PAYMENT_ID}`).reply(404, { success: false })

    const response = await client.get(`/api/payment/status/${VALID_PAYMENT_ID}`)

    response.assertStatus(404)
    response.assertBodyContains({ status: 'not_found' })
    assert.isTrue(nock.isDone())
  })

  test('returns { status: expired } for an expired pending payment', async ({ client }) => {
    await createPendingPayment({ expiresAt: DateTime.now().minus({ seconds: 1 }) })

    const response = await client.get(`/api/payment/status/${VALID_PAYMENT_ID}`)

    response.assertStatus(200)
    response.assertBodyContains({ status: 'expired' })
  })
})
