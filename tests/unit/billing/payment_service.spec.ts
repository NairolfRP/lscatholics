import { test } from '@japa/runner'
import sinon from 'sinon'
import { createHmac } from 'node:crypto'
import { DateTime } from 'luxon'
import testUtils from '@adonisjs/core/services/test_utils'
import { PaymentService } from '#billing/services/payment_service'
import { PaymentHandlerRegistry } from '#billing/handlers/payment_handler_registry'
import PendingPayment from '#billing/models/pending_payment'
import PaymentException from '#billing/exceptions/payment_exception'
import fleecaConfig from '#config/fleeca'
import type { FleecaWebhookPayload } from '#billing/types/payment'

function sign(rawBody: string): string {
  return `sha256=${createHmac('sha256', fleecaConfig.apiKey.release()).update(rawBody).digest('hex')}`
}

const VALID_PAYMENT_ID = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
const VALID_AMOUNT = 1_000
const VALID_SOURCE = 'donation'
const VALID_MODE: 'live' | 'sandbox' = fleecaConfig.mode === 1 ? 'live' : 'sandbox'

function makeWebhookPayload(overrides: Partial<FleecaWebhookPayload> = {}): FleecaWebhookPayload {
  return {
    payment_id: VALID_PAYMENT_ID,
    payment_url: `https://fleeca.gta.world/gateway/${VALID_PAYMENT_ID}`,
    mode: VALID_MODE,
    amount: VALID_AMOUNT,
    payer_routing: '020001001',
    status: 'payment_successful',
    created_at: new Date().toISOString(),
    paid_at: new Date().toISOString(),
    ...overrides,
  }
}

function makeMockClient(overrides: Record<string, sinon.SinonStub | unknown> = {}) {
  return {
    createPayment: sinon.stub().resolves({
      success: true,
      payment_id: VALID_PAYMENT_ID,
      payment_link: `https://fleeca.gta.world/gateway/${VALID_PAYMENT_ID}`,
      message: 'Payment created successfully.',
    }),
    getPayment: sinon.stub(),
    verifyWebhookSignature: sinon
      .stub()
      .callsFake((rawBody: string, sig: string) => sig === sign(rawBody)),
    ...overrides,
  }
}

function makeRegistryWithHandler(sources: string[] = [VALID_SOURCE]) {
  const registry = new PaymentHandlerRegistry()
  const handlers: Record<
    string,
    { source: string; onSuccess: sinon.SinonStub; onFailure: sinon.SinonStub }
  > = {}

  for (const source of sources) {
    const handler = {
      source,
      onSuccess: sinon.stub().resolves(),
      onFailure: sinon.stub().resolves(),
    }
    registry.register(handler)
    handlers[source] = handler
  }

  return { registry, handlers }
}

async function createPendingPayment(
  overrides: Partial<{ id: string; amount: number; mode: 0 | 1; expiresAt: DateTime }> = {}
) {
  return PendingPayment.create({
    id: overrides.id ?? VALID_PAYMENT_ID,
    source: VALID_SOURCE,
    amount: overrides.amount ?? VALID_AMOUNT,
    mode: overrides.mode ?? fleecaConfig.mode,
    metadata: { firstname: 'John', lastname: 'Doe', anonymous: false },
    expiresAt: overrides.expiresAt ?? DateTime.now().plus({ minutes: 30 }),
  })
}

test.group('PaymentService.initiatePayment', (group) => {
  group.each.setup(() => testUtils.db().wrapInGlobalTransaction())
  group.each.teardown(() => sinon.restore())

  test('creates a pending payment record and returns the Fleeca payment URL', async ({
    assert,
  }) => {
    const mockClient = makeMockClient()
    const { registry } = makeRegistryWithHandler()
    const service = new PaymentService(mockClient as any, registry)

    const result = await service.initiatePayment({
      source: VALID_SOURCE,
      amount: VALID_AMOUNT,
      metadata: { firstname: 'John' },
      description: 'Test donation',
    })

    assert.equal(result.paymentId, VALID_PAYMENT_ID)
    assert.equal(result.paymentUrl, `https://fleeca.gta.world/gateway/${VALID_PAYMENT_ID}`)

    const pending = await PendingPayment.find(VALID_PAYMENT_ID)
    assert.isNotNull(pending)
    assert.equal(pending!.source, VALID_SOURCE)
    assert.equal(pending!.amount, VALID_AMOUNT)
    assert.deepEqual(pending!.metadata, { firstname: 'John' })

    sinon.assert.calledOnce(mockClient.createPayment as sinon.SinonStub)
  })

  test('passes description and mode to Fleeca API', async () => {
    const mockClient = makeMockClient()
    const { registry } = makeRegistryWithHandler()
    const service = new PaymentService(mockClient as any, registry)

    await service.initiatePayment({
      source: VALID_SOURCE,
      amount: VALID_AMOUNT,
      description: 'Don — John Doe',
    })

    sinon.assert.calledOnceWithMatch(mockClient.createPayment as sinon.SinonStub, {
      amount: VALID_AMOUNT,
      mode: fleecaConfig.mode,
      description: 'Don — John Doe',
    })
  })

  test('throws INVALID_PRICE for amounts <= 0', async ({ assert }) => {
    const { registry } = makeRegistryWithHandler()
    const service = new PaymentService(makeMockClient() as any, registry)

    for (const amount of [0, -1, -999]) {
      await assert.rejects(
        () => service.initiatePayment({ source: VALID_SOURCE, amount }),
        'The payment amount must be greater than 0'
      )
    }
  })

  test('throws INVALID_PARAMETERS for empty or blank source', async ({ assert }) => {
    const { registry } = makeRegistryWithHandler()
    const service = new PaymentService(makeMockClient() as any, registry)

    for (const source of ['', '   ']) {
      await assert.rejects(
        () => service.initiatePayment({ source, amount: VALID_AMOUNT }),
        'Payment source is required'
      )
    }
  })

  test('throws INVALID_PARAMETERS when no handler is registered for the source', async ({
    assert,
  }) => {
    const { registry } = makeRegistryWithHandler([])
    const service = new PaymentService(makeMockClient() as any, registry)

    await assert.rejects(
      () => service.initiatePayment({ source: 'unknown-source', amount: VALID_AMOUNT }),
      'No handler registered for payment source "unknown-source"'
    )
  })
})

test.group('PaymentService.processWebhook — security', (group) => {
  let fleecaApiKey: string
  group.each.setup(() => {
    fleecaApiKey = fleecaConfig.apiKey.release()
    return testUtils.db().wrapInGlobalTransaction()
  })
  group.each.teardown(() => sinon.restore())

  test('throws WEBHOOK_SIGNATURE_INVALID for a forged signature', async ({ assert }) => {
    const { registry } = makeRegistryWithHandler()
    const service = new PaymentService(makeMockClient() as any, registry)

    const body = JSON.stringify(makeWebhookPayload())

    await assert.rejects(
      () =>
        service.processWebhook(
          body,
          'sha256=0000000000000000000000000000000000000000000000000000000000000000'
        ),
      'Webhook signature verification failed'
    )
  })

  test('throws WEBHOOK_SIGNATURE_INVALID for a signature computed with a wrong key', async ({
    assert,
  }) => {
    const { registry } = makeRegistryWithHandler()
    const service = new PaymentService(makeMockClient() as any, registry)

    const body = JSON.stringify(makeWebhookPayload())
    const wrongSig = `sha256=${createHmac('sha256', 'wrong-key').update(body).digest('hex')}`

    await assert.rejects(
      () => service.processWebhook(body, wrongSig),
      'Webhook signature verification failed'
    )
  })

  test('throws WEBHOOK_SIGNATURE_INVALID when signature prefix is missing', async ({ assert }) => {
    const { registry } = makeRegistryWithHandler()
    const service = new PaymentService(makeMockClient() as any, registry)

    const body = JSON.stringify(makeWebhookPayload())
    const rawHex = createHmac('sha256', fleecaApiKey).update(body).digest('hex')

    await assert.rejects(
      () => service.processWebhook(body, rawHex),
      'Webhook signature verification failed'
    )
  })

  test('throws VALIDATION_ERROR for a malformed JSON body', async ({ assert }) => {
    const { registry } = makeRegistryWithHandler()
    const mockClient = makeMockClient({
      verifyWebhookSignature: sinon.stub().returns(true),
    })
    const service = new PaymentService(mockClient as any, registry)

    await assert.rejects(
      () => service.processWebhook('not-valid-json{{{', 'sha256=anything'),
      'Error while validating the payment data'
    )
  })
})

test.group('PaymentService.processWebhook — business logic', (group) => {
  group.each.setup(() => testUtils.db().wrapInGlobalTransaction())
  group.each.teardown(() => sinon.restore())

  test('silently ignores webhook for an unknown payment_id', async ({ assert }) => {
    const { registry, handlers } = makeRegistryWithHandler()
    const service = new PaymentService(makeMockClient() as any, registry)

    const body = JSON.stringify(makeWebhookPayload({ payment_id: 'unknown-id' }))
    await assert.doesNotReject(() => service.processWebhook(body, sign(body)))

    sinon.assert.notCalled(handlers[VALID_SOURCE].onSuccess)
    sinon.assert.notCalled(handlers[VALID_SOURCE].onFailure)
  })

  test('keeps the pending record alive for intermediate "pending" status', async ({ assert }) => {
    await createPendingPayment()
    const { registry, handlers } = makeRegistryWithHandler()
    const service = new PaymentService(makeMockClient() as any, registry)

    const body = JSON.stringify(makeWebhookPayload({ status: 'pending' }))
    await assert.doesNotReject(() => service.processWebhook(body, sign(body)))

    sinon.assert.notCalled(handlers[VALID_SOURCE].onSuccess)

    const pending = await PendingPayment.find(VALID_PAYMENT_ID)
    assert.isNotNull(pending)
  })

  test('throws WEBHOOK_AMOUNT_MISMATCH and deletes the pending record when amounts differ', async ({
    assert,
  }) => {
    await createPendingPayment({ amount: VALID_AMOUNT })
    const { registry } = makeRegistryWithHandler()
    const service = new PaymentService(makeMockClient() as any, registry)

    const body = JSON.stringify(makeWebhookPayload({ amount: VALID_AMOUNT * 2 }))

    await assert.rejects(() => service.processWebhook(body, sign(body)), /amount mismatch/i)

    const pending = await PendingPayment.find(VALID_PAYMENT_ID)
    assert.isNull(pending)
  })

  test('throws WEBHOOK_MODE_MISMATCH and deletes the pending record when modes differ', async ({
    assert,
  }) => {
    await createPendingPayment()
    const { registry } = makeRegistryWithHandler()
    const service = new PaymentService(makeMockClient() as any, registry)

    const wrongMode: 'live' | 'sandbox' = VALID_MODE === 'live' ? 'sandbox' : 'live'
    const body = JSON.stringify(makeWebhookPayload({ mode: wrongMode }))

    await assert.rejects(() => service.processWebhook(body, sign(body)), /mode mismatch/i)

    const pending = await PendingPayment.find(VALID_PAYMENT_ID)
    assert.isNull(pending)
  })

  test('ignores and deletes an expired pending payment when webhook arrives late', async ({
    assert,
  }) => {
    await createPendingPayment({ expiresAt: DateTime.now().minus({ seconds: 1 }) })
    const { registry, handlers } = makeRegistryWithHandler()
    const service = new PaymentService(makeMockClient() as any, registry)

    const body = JSON.stringify(makeWebhookPayload())
    await assert.doesNotReject(() => service.processWebhook(body, sign(body)))

    sinon.assert.notCalled(handlers[VALID_SOURCE].onSuccess)

    const pending = await PendingPayment.find(VALID_PAYMENT_ID)
    assert.isNull(pending)
  })

  test('calls onSuccess and deletes the pending record on payment_successful', async ({
    assert,
  }) => {
    await createPendingPayment()
    const { registry, handlers } = makeRegistryWithHandler()
    const service = new PaymentService(makeMockClient() as any, registry)

    const body = JSON.stringify(makeWebhookPayload({ status: 'payment_successful' }))
    await service.processWebhook(body, sign(body))

    sinon.assert.calledOnce(handlers[VALID_SOURCE].onSuccess)
    sinon.assert.notCalled(handlers[VALID_SOURCE].onFailure)

    const pending = await PendingPayment.find(VALID_PAYMENT_ID)
    assert.isNull(pending)
  })

  test('passes the pending record to the handler so it can access metadata', async ({ assert }) => {
    await createPendingPayment()
    const { registry, handlers } = makeRegistryWithHandler()
    const service = new PaymentService(makeMockClient() as any, registry)

    const body = JSON.stringify(makeWebhookPayload())
    await service.processWebhook(body, sign(body))

    const [calledWith] = handlers[VALID_SOURCE].onSuccess.firstCall.args
    assert.equal(calledWith.id, VALID_PAYMENT_ID)
    assert.equal(calledWith.amount, VALID_AMOUNT)
    assert.equal(calledWith.source, VALID_SOURCE)
  })

  test('calls onFailure and deletes the pending record on payment_failed', async ({ assert }) => {
    await createPendingPayment()
    const { registry, handlers } = makeRegistryWithHandler()
    const service = new PaymentService(makeMockClient() as any, registry)

    const body = JSON.stringify(makeWebhookPayload({ status: 'payment_failed' }))
    await service.processWebhook(body, sign(body))

    sinon.assert.calledOnce(handlers[VALID_SOURCE].onFailure)
    sinon.assert.notCalled(handlers[VALID_SOURCE].onSuccess)

    const pending = await PendingPayment.find(VALID_PAYMENT_ID)
    assert.isNull(pending)
  })

  test('does not call handler twice on duplicate webhook (idempotency)', async ({ assert }) => {
    await createPendingPayment()
    const { registry, handlers } = makeRegistryWithHandler()
    const service = new PaymentService(makeMockClient() as any, registry)

    const body = JSON.stringify(makeWebhookPayload({ status: 'payment_successful' }))
    const sig = sign(body)

    await service.processWebhook(body, sig)
    await assert.doesNotReject(() => service.processWebhook(body, sig))

    sinon.assert.calledOnce(handlers[VALID_SOURCE].onSuccess)
  })
})

test.group('PaymentService.resolvePaymentStatus', (group) => {
  group.each.setup(() => testUtils.db().wrapInGlobalTransaction())
  group.each.teardown(() => sinon.restore())

  test('returns pending_table for a valid in-flight payment', async ({ assert }) => {
    await createPendingPayment()
    const { registry } = makeRegistryWithHandler()
    const service = new PaymentService(makeMockClient() as any, registry)

    const result = await service.resolvePaymentStatus(VALID_PAYMENT_ID)

    assert.equal(result.origin, 'pending_table')
    if (result.origin === 'pending_table') {
      assert.equal(result.status, 'pending')
      assert.equal(result.amount, VALID_AMOUNT)
      assert.equal(result.source, VALID_SOURCE)
    }
  })

  test('deletes expired pending record and returns expired', async ({ assert }) => {
    await createPendingPayment({ expiresAt: DateTime.now().minus({ seconds: 1 }) })
    const { registry } = makeRegistryWithHandler()
    const service = new PaymentService(makeMockClient() as any, registry)

    const result = await service.resolvePaymentStatus(VALID_PAYMENT_ID)

    assert.equal(result.origin, 'expired')

    const pending = await PendingPayment.find(VALID_PAYMENT_ID)
    assert.isNull(pending)
  })

  test('falls back to Fleeca API when record is gone (webhook already processed)', async ({
    assert,
  }) => {
    const mockClient = makeMockClient({
      getPayment: sinon.stub().resolves({
        payment_id: VALID_PAYMENT_ID,
        status: 'payment_successful',
        amount: VALID_AMOUNT,
        mode: VALID_MODE,
        merchant_id: 1,
        description: null,
        payer_routing: '020001001',
        paid_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }),
    })
    const { registry } = makeRegistryWithHandler()
    const service = new PaymentService(mockClient as any, registry)

    const result = await service.resolvePaymentStatus(VALID_PAYMENT_ID)

    assert.equal(result.origin, 'fleeca_api')
    if (result.origin === 'fleeca_api') {
      assert.equal(result.status, 'payment_successful')
      assert.equal(result.amount, VALID_AMOUNT)
    }
    sinon.assert.calledOnce(mockClient.getPayment as sinon.SinonStub)
  })

  test('returns not_found when Fleeca API responds with HTTP error', async ({ assert }) => {
    const mockClient = makeMockClient({
      getPayment: sinon.stub().rejects(PaymentException.create('HTTP_CLIENT_ERROR')),
    })
    const { registry } = makeRegistryWithHandler()
    const service = new PaymentService(mockClient as any, registry)

    const result = await service.resolvePaymentStatus('genuinely-unknown-id')

    assert.equal(result.origin, 'not_found')
  })

  test('re-throws non-HTTP errors from the Fleeca API', async ({ assert }) => {
    const mockClient = makeMockClient({
      getPayment: sinon.stub().rejects(PaymentException.create('NETWORK_ERROR')),
    })
    const { registry } = makeRegistryWithHandler()
    const service = new PaymentService(mockClient as any, registry)

    await assert.rejects(
      () => service.resolvePaymentStatus(VALID_PAYMENT_ID),
      'Network error while connecting to the payment service'
    )
  })
})
