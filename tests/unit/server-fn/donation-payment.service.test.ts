import { setResponseStatus } from '@tanstack/react-start/server'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { DONATION_SOURCE } from '#/features/donate/constants/donate.constants.ts'
import { initiateDonation } from '#/features/donate/server/donation-payment.service.ts'
import type { DonationMetadata } from '#/features/donate/types/donate.types.ts'
import { notFoundCache } from '#server/payments/not-found-cache.ts'
import { decryptMetadata, encryptMetadata } from '#server/payments/payment-crypto.service.ts'
import { paymentService } from '#server/payments/payment.service.ts'
import type { NewPendingPayment } from '#server/repositories/pending-payment.repository.ts'
import { pendingPaymentRepository } from '#server/repositories/pending-payment.repository.ts'
import type { FleecaWebhookPayload } from '#server/services/fleeca.service.ts'

const mocks = vi.hoisted(() => {
  class FleecaClientError extends Error {
    readonly status?: number

    constructor(
      message: string,
      readonly code:
        | 'UNCONFIGURED'
        | 'NETWORK'
        | 'HTTP'
        | 'PROCESSING'
        | 'INVALID_PAYMENT_ID' = 'PROCESSING',
      options?: ErrorOptions & { status?: number }
    ) {
      super(message)
      this.name = 'FleecaClientError'
      this.status = options?.status
    }
  }

  return {
    FleecaClientError,
    fleecaClient: {
      createPayment: vi.fn(),
      getPayment: vi.fn(),
      verifyWebhookSignature: vi.fn(),
    },
    __inProd: false,
    setInProd(value: boolean) {
      mocks.__inProd = value
    },
    sendPrivateDonationNotification: vi.fn(async () => {}),
    sendPublicDonationNotification: vi.fn(async () => {}),
  }
})

vi.mock('#server/services/fleeca.service.ts', () => ({
  FleecaClientError: mocks.FleecaClientError,
  fleecaClient: mocks.fleecaClient,
  FLEECA_PAYMENT_MODE: { SANDBOX: 0, LIVE: 1 },
}))

vi.mock('#server/services/app.service.ts', () => ({
  get inProd() {
    return mocks.__inProd
  },
  inDev: false,
}))

vi.mock('#/features/donate/server/donation-notification.service.ts', () => ({
  sendPrivateDonationNotification: mocks.sendPrivateDonationNotification,
  sendPublicDonationNotification: mocks.sendPublicDonationNotification,
}))

beforeEach(() => {
  notFoundCache.clear()
  mocks.setInProd(false)
})

const validData = {
  amount: 500,
  firstname: 'Jean',
  lastname: 'Valjean',
  age: '46',
  ethnicity: 'white',
  phone: '123456',
  address: '12 Ginger Street',
  district: 'little_seoul',
  isOrganization: false,
  organizationName: '',
  anonymous: false,
  fleecaConfirmation: true,
}

function webhookPayload(overrides: Partial<FleecaWebhookPayload> = {}): FleecaWebhookPayload {
  return {
    payment_id: 'pay_1',
    payment_url: 'https://fleeca.example/pay_1',
    mode: 'sandbox',
    amount: 500,
    payer_routing: 'routing-1',
    payer_name: null,
    status: 'payment_successful',
    description: '',
    status_reason: '',
    created_at: '2026-08-05T14:00:00.000Z',
    paid_at: '2026-08-05T14:00:00.000Z',
    ...overrides,
  }
}

async function createPendingPayment(overrides: Partial<NewPendingPayment> = {}) {
  const metadata: DonationMetadata = {
    amount: 500,
    firstname: 'Jean',
    lastname: 'Valjean',
    age: 46,
    ethnicity: 'white',
    phone: '123456',
    address: '12 Ginger Street',
    district: 'little_seoul',
    isOrganization: false,
    organizationName: '',
    anonymous: false,
  }

  return pendingPaymentRepository.create({
    id: 'pay_1',
    source: DONATION_SOURCE,
    amount: 500,
    mode: 0,
    metadata: encryptMetadata(metadata),
    expiresAt: new Date(Date.now() + 60_000),
    ...overrides,
  })
}

describe('initiateDonation', () => {
  it('creates a Fleeca payment and stores the encrypted pending payment', async () => {
    mocks.fleecaClient.createPayment.mockResolvedValue({
      success: true,
      payment_id: 'pay_123',
      payment_link: 'https://fleeca.example/pay_123',
      message: 'ok',
    })

    const result = await initiateDonation(validData)

    expect(result).toEqual({
      success: true,
      paymentUrl: 'https://fleeca.example/pay_123',
    })
    expect(mocks.fleecaClient.createPayment).toHaveBeenCalledWith({
      amount: 500,
      mode: 0,
      description: 'Don — Jean Valjean',
    })

    const record = await pendingPaymentRepository.findById('pay_123')
    expect(record).toBeDefined()
    expect(record?.amount).toBe(500)
    expect(record?.mode).toBe(0)
    expect(record?.source).toBe(DONATION_SOURCE)
    expect(decryptMetadata<DonationMetadata>(record!.metadata)).toMatchObject({
      firstname: 'Jean',
      lastname: 'Valjean',
      amount: 500,
    })
  })

  it('creates a live payment, never a sandbox one, in production', async () => {
    mocks.setInProd(true)
    mocks.fleecaClient.createPayment.mockResolvedValue({
      success: true,
      payment_id: 'pay_456',
      payment_link: 'https://fleeca.example/pay_456',
      message: 'ok',
    })

    const result = await initiateDonation(validData)

    expect(result).toEqual({
      success: true,
      paymentUrl: 'https://fleeca.example/pay_456',
    })
    expect(mocks.fleecaClient.createPayment).toHaveBeenCalledWith(
      expect.objectContaining({ mode: 1 })
    )

    const record = await pendingPaymentRepository.findById('pay_456')
    expect(record?.mode).toBe(1)
  })

  it('returns validation errors for invalid data without calling Fleeca', async () => {
    const result = await initiateDonation({ ...validData, firstname: '' })

    expect(result.success).toBe(false)
    expect(result.validationErrors?.firstname).toBeDefined()
    expect(setResponseStatus).toHaveBeenCalledWith(400)
    expect(mocks.fleecaClient.createPayment).not.toHaveBeenCalled()
  })

  it('returns a 503 error when Fleeca is not configured', async () => {
    mocks.fleecaClient.createPayment.mockRejectedValue(
      new mocks.FleecaClientError('no key', 'UNCONFIGURED')
    )

    const result = await initiateDonation(validData)

    expect(result).toEqual({
      success: false,
      error: 'Les dons en ligne sont temporairement indisponibles. Réessayez plus tard.',
    })
    expect(setResponseStatus).toHaveBeenCalledWith(503)
  })

  it('returns a generic error when Fleeca fails unexpectedly', async () => {
    mocks.fleecaClient.createPayment.mockRejectedValue(new Error('boom'))

    const result = await initiateDonation(validData)

    expect(result).toEqual({
      success: false,
      error: 'Une erreur est survenue lors de la création du paiement. Veuillez réessayer.',
    })
    expect(setResponseStatus).toHaveBeenCalledWith(500)
  })

  it('returns a 400 error when Fleeca rejects the payment with a 422 validation error', async () => {
    mocks.fleecaClient.createPayment.mockRejectedValue(
      new mocks.FleecaClientError('422', 'HTTP', { status: 422 })
    )

    const result = await initiateDonation(validData)

    expect(result).toEqual({
      success: false,
      error: 'Les informations de paiement sont invalides. Veuillez réessayer.',
    })
    expect(setResponseStatus).toHaveBeenCalledWith(400)
  })
})

describe('paymentService.resolvePaymentStatus', () => {
  it('returns the pending payment amount while it is still valid', async () => {
    await createPendingPayment()

    await expect(paymentService.resolvePaymentStatus('pay_1')).resolves.toEqual({
      origin: 'pending',
      amount: 500,
    })
  })

  it('rejects a sandbox payment in production without consulting Fleeca', async () => {
    await createPendingPayment()
    mocks.setInProd(true)

    await expect(paymentService.resolvePaymentStatus('pay_1')).resolves.toEqual({
      origin: 'expired',
    })
    expect(mocks.fleecaClient.getPayment).not.toHaveBeenCalled()
    expect(mocks.sendPrivateDonationNotification).not.toHaveBeenCalled()
    await expect(pendingPaymentRepository.findById('pay_1')).resolves.toBeDefined()
  })

  it('keeps an expired payment when Fleeca still has it pending', async () => {
    await createPendingPayment({ mode: 1, expiresAt: new Date(Date.now() - 60_000) })
    mocks.fleecaClient.getPayment.mockResolvedValue({
      payment_id: 'pay_1',
      status: 'pending',
      amount: 500,
    })

    await expect(paymentService.resolvePaymentStatus('pay_1')).resolves.toEqual({
      origin: 'pending',
      amount: 500,
    })
    await expect(pendingPaymentRepository.findById('pay_1')).resolves.toBeDefined()
  })

  it('reconciles an expired payment that actually succeeded at Fleeca', async () => {
    await createPendingPayment({ mode: 1, expiresAt: new Date(Date.now() - 60_000) })
    mocks.fleecaClient.getPayment.mockResolvedValue({
      payment_id: 'pay_1',
      status: 'payment_successful',
      amount: 500,
    })

    await expect(paymentService.resolvePaymentStatus('pay_1')).resolves.toEqual({
      origin: 'fleeca_api',
      status: 'payment_successful',
      amount: 500,
    })
    expect(mocks.sendPrivateDonationNotification).toHaveBeenCalledWith(
      expect.objectContaining({ firstname: 'Jean', amount: 500 })
    )
    await expect(pendingPaymentRepository.findById('pay_1')).resolves.toBeUndefined()
  })

  it('reconciles an expired payment that failed at Fleeca', async () => {
    await createPendingPayment({ mode: 1, expiresAt: new Date(Date.now() - 60_000) })
    mocks.fleecaClient.getPayment.mockResolvedValue({
      payment_id: 'pay_1',
      status: 'payment_failed',
      amount: 500,
    })

    await expect(paymentService.resolvePaymentStatus('pay_1')).resolves.toEqual({
      origin: 'fleeca_api',
      status: 'payment_failed',
      amount: 500,
    })
    expect(mocks.sendPrivateDonationNotification).not.toHaveBeenCalled()
    await expect(pendingPaymentRepository.findById('pay_1')).resolves.toBeUndefined()
  })

  it('keeps an expired payment for a later attempt when Fleeca is unreachable', async () => {
    await createPendingPayment({ mode: 1, expiresAt: new Date(Date.now() - 60_000) })
    mocks.fleecaClient.getPayment.mockRejectedValue(new Error('boom'))

    await expect(paymentService.resolvePaymentStatus('pay_1')).resolves.toEqual({
      origin: 'expired',
    })
    await expect(pendingPaymentRepository.findById('pay_1')).resolves.toBeDefined()
  })

  it('reaps an expired sandbox payment without consulting Fleeca', async () => {
    await createPendingPayment({ expiresAt: new Date(Date.now() - 60_000) })

    await expect(paymentService.resolvePaymentStatus('pay_1')).resolves.toEqual({
      origin: 'expired',
    })
    await expect(pendingPaymentRepository.findById('pay_1')).resolves.toBeUndefined()
    expect(mocks.fleecaClient.getPayment).not.toHaveBeenCalled()
    expect(mocks.sendPrivateDonationNotification).not.toHaveBeenCalled()
  })

  it('reconciles every expired payment on cleanup', async () => {
    await createPendingPayment({ mode: 1, expiresAt: new Date(Date.now() - 60_000) })
    await pendingPaymentRepository.create({
      id: 'pay_2',
      source: DONATION_SOURCE,
      amount: 300,
      mode: 1,
      metadata: encryptMetadata({
        amount: 300,
        firstname: 'Jean',
        lastname: 'Valjean',
        age: 46,
        ethnicity: 'white',
        phone: '123456',
        address: '12 Ginger Street',
        district: 'little_seoul',
        isOrganization: false,
        organizationName: '',
        anonymous: false,
      }),
      expiresAt: new Date(Date.now() - 60_000),
    })
    mocks.fleecaClient.getPayment.mockImplementation((id: string) =>
      id === 'pay_1'
        ? { payment_id: id, status: 'payment_successful', amount: 500 }
        : { payment_id: id, status: 'pending', amount: 300 }
    )

    await expect(paymentService.reconcileExpiredPayments()).resolves.toEqual({
      reconciled: 1,
      deleted: 0,
    })
    await expect(pendingPaymentRepository.findById('pay_1')).resolves.toBeUndefined()
    await expect(pendingPaymentRepository.findById('pay_2')).resolves.toBeDefined()
  })

  it('reaps an expired payment still pending beyond the reconciliation age', async () => {
    await createPendingPayment({
      mode: 1,
      expiresAt: new Date(Date.now() - 60_000),
      createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1_000),
    })

    await expect(paymentService.resolvePaymentStatus('pay_1')).resolves.toEqual({
      origin: 'expired',
    })
    await expect(pendingPaymentRepository.findById('pay_1')).resolves.toBeUndefined()
    expect(mocks.fleecaClient.getPayment).not.toHaveBeenCalled()
  })

  it('answers repeated lookups of an unknown payment from the not-found cache', async () => {
    mocks.fleecaClient.getPayment.mockRejectedValue(
      new mocks.FleecaClientError('404', 'HTTP', { status: 404 })
    )

    await expect(paymentService.resolvePaymentStatus('pay_404')).resolves.toEqual({
      origin: 'not_found',
    })
    await expect(paymentService.resolvePaymentStatus('pay_404')).resolves.toEqual({
      origin: 'not_found',
    })

    expect(mocks.fleecaClient.getPayment).toHaveBeenCalledTimes(1)
  })

  it('falls back to the Fleeca API when the payment is not pending', async () => {
    mocks.fleecaClient.getPayment.mockResolvedValue({
      payment_id: 'pay_1',
      status: 'payment_successful',
      amount: 500,
    })

    await expect(paymentService.resolvePaymentStatus('pay_1')).resolves.toEqual({
      origin: 'fleeca_api',
      status: 'payment_successful',
      amount: 500,
    })
  })

  it('reports a not_found status when Fleeca answers with a 404', async () => {
    mocks.fleecaClient.getPayment.mockRejectedValue(
      new mocks.FleecaClientError('404', 'HTTP', { status: 404 })
    )

    await expect(paymentService.resolvePaymentStatus('pay_1')).resolves.toEqual({
      origin: 'not_found',
    })
  })

  it('reports a not_found status for an unsafe payment id', async () => {
    mocks.fleecaClient.getPayment.mockRejectedValue(
      new mocks.FleecaClientError('unsafe id', 'INVALID_PAYMENT_ID')
    )

    await expect(paymentService.resolvePaymentStatus('../balance')).resolves.toEqual({
      origin: 'not_found',
    })
  })

  it('rethrows Fleeca HTTP errors other than 404', async () => {
    mocks.fleecaClient.getPayment.mockRejectedValue(
      new mocks.FleecaClientError('401', 'HTTP', { status: 401 })
    )

    await expect(paymentService.resolvePaymentStatus('pay_1')).rejects.toMatchObject({
      code: 'HTTP',
      status: 401,
    })
  })

  it('rethrows unexpected Fleeca errors', async () => {
    mocks.fleecaClient.getPayment.mockRejectedValue(new Error('boom'))

    await expect(paymentService.resolvePaymentStatus('pay_1')).rejects.toThrow('boom')
  })
})

describe('paymentService.processWebhook', () => {
  it('rejects a webhook without a signature', async () => {
    const result = await paymentService.processWebhook({ rawBody: '{}', signature: '' })

    expect(result).toEqual({ status: 403, body: 'Forbidden' })
  })

  it('rejects an oversized webhook body', async () => {
    mocks.fleecaClient.verifyWebhookSignature.mockClear()

    const result = await paymentService.processWebhook({
      rawBody: JSON.stringify({ padding: 'x'.repeat(20_000) }),
      signature: 'sha256=x',
    })

    expect(result).toEqual({ status: 413, body: 'Payload Too Large' })
    expect(mocks.fleecaClient.verifyWebhookSignature).not.toHaveBeenCalled()
  })

  it('rejects a webhook with an invalid signature', async () => {
    mocks.fleecaClient.verifyWebhookSignature.mockReturnValue(false)

    const result = await paymentService.processWebhook({
      rawBody: '{}',
      signature: 'sha256=invalid',
    })

    expect(result).toEqual({ status: 403, body: 'Forbidden' })
  })

  it('acknowledges a non-JSON body', async () => {
    mocks.fleecaClient.verifyWebhookSignature.mockReturnValue(true)

    const result = await paymentService.processWebhook({
      rawBody: 'not-json',
      signature: 'sha256=x',
    })

    expect(result).toEqual({ status: 200, body: 'OK' })
  })

  it('rejects a webhook whose payload is missing required fields', async () => {
    mocks.fleecaClient.verifyWebhookSignature.mockReturnValue(true)

    const result = await paymentService.processWebhook({
      rawBody: JSON.stringify({ payment_id: 'pay_1', status: 'payment_successful' }),
      signature: 'sha256=x',
    })

    expect(result).toEqual({ status: 400, body: 'Bad Request' })
  })

  it('rejects a webhook with an unknown status', async () => {
    mocks.fleecaClient.verifyWebhookSignature.mockReturnValue(true)

    const result = await paymentService.processWebhook({
      rawBody: JSON.stringify({
        payment_id: 'pay_1',
        mode: 'sandbox',
        amount: 500,
        status: 'refunded',
      }),
      signature: 'sha256=x',
    })

    expect(result).toEqual({ status: 400, body: 'Bad Request' })
  })

  it('ignores a webhook for an unknown payment', async () => {
    mocks.fleecaClient.verifyWebhookSignature.mockReturnValue(true)

    const result = await paymentService.processWebhook({
      rawBody: JSON.stringify(webhookPayload()),
      signature: 'sha256=x',
    })

    expect(result).toEqual({ status: 200, body: 'OK' })
    expect(mocks.sendPrivateDonationNotification).not.toHaveBeenCalled()
  })

  it('returns 500 and keeps the payment when the amount does not match', async () => {
    await createPendingPayment()
    mocks.fleecaClient.verifyWebhookSignature.mockReturnValue(true)

    const result = await paymentService.processWebhook({
      rawBody: JSON.stringify(webhookPayload({ amount: 999 })),
      signature: 'sha256=x',
    })

    expect(result).toEqual({ status: 500, body: 'Internal Server Error' })
    await expect(pendingPaymentRepository.findById('pay_1')).resolves.toBeDefined()
    expect(mocks.sendPrivateDonationNotification).not.toHaveBeenCalled()
  })

  it('returns 500 and keeps the payment when the mode does not match', async () => {
    await createPendingPayment()
    mocks.fleecaClient.verifyWebhookSignature.mockReturnValue(true)

    const result = await paymentService.processWebhook({
      rawBody: JSON.stringify(webhookPayload({ mode: 'live' })),
      signature: 'sha256=x',
    })

    expect(result).toEqual({ status: 500, body: 'Internal Server Error' })
    await expect(pendingPaymentRepository.findById('pay_1')).resolves.toBeDefined()
  })

  it('rejects a sandbox webhook in production without notifying', async () => {
    await createPendingPayment()
    mocks.setInProd(true)
    mocks.fleecaClient.verifyWebhookSignature.mockReturnValue(true)

    const result = await paymentService.processWebhook({
      rawBody: JSON.stringify(webhookPayload()),
      signature: 'sha256=x',
    })

    expect(result).toEqual({ status: 500, body: 'Internal Server Error' })
    expect(mocks.sendPrivateDonationNotification).not.toHaveBeenCalled()
    expect(mocks.sendPublicDonationNotification).not.toHaveBeenCalled()
    await expect(pendingPaymentRepository.findById('pay_1')).resolves.toBeDefined()
  })

  it('processes a sandbox webhook for a sandbox payment outside production', async () => {
    await createPendingPayment()
    mocks.fleecaClient.verifyWebhookSignature.mockReturnValue(true)

    const result = await paymentService.processWebhook({
      rawBody: JSON.stringify(webhookPayload()),
      signature: 'sha256=x',
    })

    expect(result).toEqual({ status: 200, body: 'OK' })
    expect(mocks.sendPrivateDonationNotification).toHaveBeenCalledWith(
      expect.objectContaining({ firstname: 'Jean', amount: 500 })
    )
    await expect(pendingPaymentRepository.findById('pay_1')).resolves.toBeUndefined()
  })

  it('processes an expired payment on webhook when Fleeca reports a terminal status', async () => {
    await createPendingPayment({ expiresAt: new Date(Date.now() - 60_000) })
    mocks.fleecaClient.verifyWebhookSignature.mockReturnValue(true)

    const result = await paymentService.processWebhook({
      rawBody: JSON.stringify(webhookPayload()),
      signature: 'sha256=x',
    })

    expect(result).toEqual({ status: 200, body: 'OK' })
    expect(mocks.sendPrivateDonationNotification).toHaveBeenCalledWith(
      expect.objectContaining({ firstname: 'Jean', amount: 500 })
    )
    await expect(pendingPaymentRepository.findById('pay_1')).resolves.toBeUndefined()
  })

  it('deletes an expired payment on webhook when Fleeca reports status "pending"', async () => {
    await createPendingPayment({ expiresAt: new Date(Date.now() - 60_000) })
    mocks.fleecaClient.verifyWebhookSignature.mockReturnValue(true)

    const result = await paymentService.processWebhook({
      rawBody: JSON.stringify(webhookPayload({ status: 'pending' })),
      signature: 'sha256=x',
    })

    expect(result).toEqual({ status: 200, body: 'OK' })
    await expect(pendingPaymentRepository.findById('pay_1')).resolves.toBeUndefined()
    expect(mocks.sendPrivateDonationNotification).not.toHaveBeenCalled()
  })

  it('processes a live-mode webhook for a live pending payment', async () => {
    await createPendingPayment({ mode: 1 })
    mocks.fleecaClient.verifyWebhookSignature.mockReturnValue(true)

    const result = await paymentService.processWebhook({
      rawBody: JSON.stringify(webhookPayload({ mode: 'live' })),
      signature: 'sha256=x',
    })

    expect(result).toEqual({ status: 200, body: 'OK' })
    expect(mocks.sendPrivateDonationNotification).toHaveBeenCalledWith(
      expect.objectContaining({ firstname: 'Jean', amount: 500 })
    )
    await expect(pendingPaymentRepository.findById('pay_1')).resolves.toBeUndefined()
  })

  it('keeps the pending payment when Fleeca reports status "pending"', async () => {
    await createPendingPayment()
    mocks.fleecaClient.verifyWebhookSignature.mockReturnValue(true)

    const result = await paymentService.processWebhook({
      rawBody: JSON.stringify(webhookPayload({ status: 'pending' })),
      signature: 'sha256=x',
    })

    expect(result).toEqual({ status: 200, body: 'OK' })
    await expect(pendingPaymentRepository.findById('pay_1')).resolves.toBeDefined()
    expect(mocks.sendPrivateDonationNotification).not.toHaveBeenCalled()
  })

  it('sends the notifications and deletes the payment on success', async () => {
    await createPendingPayment()
    mocks.fleecaClient.verifyWebhookSignature.mockReturnValue(true)

    const result = await paymentService.processWebhook({
      rawBody: JSON.stringify(webhookPayload()),
      signature: 'sha256=x',
    })

    expect(result).toEqual({ status: 200, body: 'OK' })
    expect(mocks.sendPrivateDonationNotification).toHaveBeenCalledWith(
      expect.objectContaining({ firstname: 'Jean', lastname: 'Valjean', amount: 500 })
    )
    expect(mocks.sendPublicDonationNotification).toHaveBeenCalledWith(
      expect.objectContaining({ firstname: 'Jean', amount: 500 })
    )
    await expect(pendingPaymentRepository.findById('pay_1')).resolves.toBeUndefined()
  })

  it('does not notify and deletes the payment when the payment failed', async () => {
    await createPendingPayment()
    mocks.fleecaClient.verifyWebhookSignature.mockReturnValue(true)

    const result = await paymentService.processWebhook({
      rawBody: JSON.stringify(webhookPayload({ status: 'payment_failed' })),
      signature: 'sha256=x',
    })

    expect(result).toEqual({ status: 200, body: 'OK' })
    expect(mocks.sendPrivateDonationNotification).not.toHaveBeenCalled()
    expect(mocks.sendPublicDonationNotification).not.toHaveBeenCalled()
    await expect(pendingPaymentRepository.findById('pay_1')).resolves.toBeUndefined()
  })

  it('returns 500 and restores the payment when the handler fails', async () => {
    await createPendingPayment()
    mocks.fleecaClient.verifyWebhookSignature.mockReturnValue(true)
    mocks.sendPrivateDonationNotification.mockRejectedValueOnce(new Error('discord down'))

    const result = await paymentService.processWebhook({
      rawBody: JSON.stringify(webhookPayload()),
      signature: 'sha256=x',
    })

    expect(result).toEqual({ status: 500, body: 'Internal Server Error' })
    const restored = await pendingPaymentRepository.findById('pay_1')
    expect(restored?.amount).toBe(500)
  })

  it('ignores a webhook already claimed by a concurrent delivery', async () => {
    await createPendingPayment()
    mocks.fleecaClient.verifyWebhookSignature.mockReturnValue(true)
    vi.spyOn(pendingPaymentRepository, 'claimAndDeleteById').mockResolvedValueOnce(undefined)

    const result = await paymentService.processWebhook({
      rawBody: JSON.stringify(webhookPayload()),
      signature: 'sha256=x',
    })

    expect(result).toEqual({ status: 200, body: 'OK' })
    expect(mocks.sendPrivateDonationNotification).not.toHaveBeenCalled()
    await expect(pendingPaymentRepository.findById('pay_1')).resolves.toBeDefined()
  })
})
