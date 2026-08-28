import { setResponseStatus } from '@tanstack/react-start/server'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { GIFT_ORDER_SOURCE } from '#/features/gift-shop/constants/gift-shop.constants.ts'
import {
  createGiftOrder,
  generateGiftOrderReference,
} from '#/features/gift-shop/server/gift-shop-order.service.ts'
import type { GiftOrderMetadata } from '#/features/gift-shop/types/gift-shop.types.ts'
import { notFoundCache } from '#server/payments/not-found-cache.ts'
import { decryptMetadata, encryptMetadata } from '#server/payments/payment-crypto.service.ts'
import { paymentService } from '#server/payments/payment.service.ts'
import type { NewPendingPayment } from '#server/repositories/pending-payment.repository.ts'
import { pendingPaymentRepository } from '#server/repositories/pending-payment.repository.ts'

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
    giftShopNotificationWebhook: undefined as string | undefined,
    setGiftShopNotificationWebhook(value: string | undefined) {
      mocks.giftShopNotificationWebhook = value
    },
    sendGiftShopNotification: vi.fn(async () => {}),
  }
})

vi.mock('#/config/env.server.ts', async (importOriginal) => {
  const original = await importOriginal<{ env: Record<string, unknown> }>()
  const env: Record<string, unknown> = Object.create(original.env)
  Object.defineProperty(env, 'GIFT_SHOP_NOTIFICATION_WEBHOOK', {
    enumerable: true,
    configurable: true,
    get: () => mocks.giftShopNotificationWebhook,
  })
  return { env }
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

vi.mock('#/features/gift-shop/server/gift-shop-notification.service.ts', () => ({
  sendGiftShopNotification: mocks.sendGiftShopNotification,
}))

beforeEach(() => {
  notFoundCache.clear()
  mocks.setInProd(false)
  mocks.setGiftShopNotificationWebhook('https://discord.example/gift-shop')
})

const validData = {
  items: [
    { productId: 'chapelet-lourdes', quantity: 2 },
    { productId: 'plaque-priere-irlandaise', quantity: 1 },
  ],
  title: 'mr',
  firstname: 'Jean',
  lastname: 'Valjean',
  phone: '123456',
  address: 'La Perla',
  fleecaConfirmation: true,
}

const createdMetadata: GiftOrderMetadata = {
  reference: 'GC-AB2CD3EF4J',
  items: [
    {
      productId: 'chapelet-lourdes',
      itemId: 3547,
      productName: 'Chapelet Notre-Dame de Lourdes',
      price: 5_095,
      quantity: 2,
    },
    {
      productId: 'plaque-priere-irlandaise',
      itemId: 6302,
      productName: 'Plaque Irlandaise',
      price: 280,
      quantity: 1,
    },
  ],
  title: 'mr',
  firstname: 'Jean',
  lastname: 'Valjean',
  phone: '123456',
  address: 'La Perla',
}

async function createPendingPayment(overrides: Partial<NewPendingPayment> = {}) {
  return pendingPaymentRepository.create({
    id: 'pay_1',
    source: GIFT_ORDER_SOURCE,
    amount: 10_470,
    mode: 0,
    metadata: encryptMetadata(createdMetadata),
    expiresAt: new Date(Date.now() + 60_000),
    ...overrides,
  })
}

describe('generateGiftOrderReference', () => {
  it('returns a unique reference in the GC-XXXX format', () => {
    const references = new Set(Array.from({ length: 100 }, () => generateGiftOrderReference()))
    expect(references.size).toBe(100)
    for (const reference of references) {
      expect(reference).toMatch(/^GC-[A-Z2-9]{10}$/)
    }
  })
})

describe('createGiftOrder', () => {
  it('creates a Fleeca payment for the cart total and stores the encrypted pending payment', async () => {
    mocks.fleecaClient.createPayment.mockResolvedValue({
      success: true,
      payment_id: 'pay_123',
      payment_link: 'https://fleeca.example/pay_123',
      message: 'ok',
    })

    const result = await createGiftOrder(validData)

    expect(result).toEqual({
      success: true,
      paymentId: 'pay_123',
      paymentUrl: 'https://fleeca.example/pay_123',
    })
    expect(mocks.fleecaClient.createPayment).toHaveBeenCalledWith(
      expect.objectContaining({
        amount: 10_470,
        mode: 0,
        description: expect.stringMatching(/^Boutique — Commande GC-[A-Z2-9]{10} — 3 articles$/),
      })
    )

    const record = await pendingPaymentRepository.findById('pay_123')
    expect(record).toBeDefined()
    expect(record?.amount).toBe(10_470)
    expect(record?.source).toBe(GIFT_ORDER_SOURCE)

    const description = mocks.fleecaClient.createPayment.mock.calls[0][0].description as string
    const reference = /GC-[A-Z2-9]{10}/.exec(description)![0]

    expect(decryptMetadata<GiftOrderMetadata>(record!.metadata)).toMatchObject({
      reference,
      items: [
        {
          productId: 'chapelet-lourdes',
          itemId: 3547,
          productName: 'Chapelet Notre-Dame de Lourdes',
          price: 5_095,
          quantity: 2,
        },
        {
          productId: 'plaque-priere-irlandaise',
          itemId: 6302,
          productName: 'Plaque Irlandaise',
          price: 280,
          quantity: 1,
        },
      ],
      firstname: 'Jean',
      lastname: 'Valjean',
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

    const result = await createGiftOrder(validData)

    expect(result).toEqual({
      success: true,
      paymentId: 'pay_456',
      paymentUrl: 'https://fleeca.example/pay_456',
    })
    expect(mocks.fleecaClient.createPayment).toHaveBeenCalledWith(
      expect.objectContaining({ mode: 1 })
    )
  })

  it('returns validation errors for invalid data without calling Fleeca', async () => {
    const result = await createGiftOrder({ ...validData, firstname: '' })

    expect(result.success).toBe(false)
    expect(result.validationErrors?.firstname).toBeDefined()
    expect(setResponseStatus).toHaveBeenCalledWith(400)
    expect(mocks.fleecaClient.createPayment).not.toHaveBeenCalled()
  })

  it('returns validation errors for an unknown product in the cart without calling Fleeca', async () => {
    const result = await createGiftOrder({
      ...validData,
      items: [{ productId: 'lego-jesus', quantity: 1 }],
    })

    expect(result.success).toBe(false)
    expect(result.validationErrors?.['items[0].productId']).toBeDefined()
    expect(setResponseStatus).toHaveBeenCalledWith(400)
    expect(mocks.fleecaClient.createPayment).not.toHaveBeenCalled()
  })

  it('rejects an empty cart without calling Fleeca', async () => {
    const result = await createGiftOrder({ ...validData, items: [] })

    expect(result.success).toBe(false)
    expect(result.validationErrors?.items).toBeDefined()
    expect(setResponseStatus).toHaveBeenCalledWith(400)
    expect(mocks.fleecaClient.createPayment).not.toHaveBeenCalled()
  })

  it('returns a 503 error without calling Fleeca when the gift shop notification webhook is not configured', async () => {
    mocks.setGiftShopNotificationWebhook(undefined)

    const result = await createGiftOrder(validData)

    expect(result).toEqual({
      success: false,
      error: 'La boutique en ligne est temporairement indisponible. Réessayez plus tard.',
    })
    expect(setResponseStatus).toHaveBeenCalledWith(503)
    expect(mocks.fleecaClient.createPayment).not.toHaveBeenCalled()
  })

  it('returns a 503 error when Fleeca is not configured', async () => {
    mocks.fleecaClient.createPayment.mockRejectedValue(
      new mocks.FleecaClientError('no key', 'UNCONFIGURED')
    )

    const result = await createGiftOrder(validData)

    expect(result).toEqual({
      success: false,
      error: 'La boutique en ligne est temporairement indisponible. Réessayez plus tard.',
    })
    expect(setResponseStatus).toHaveBeenCalledWith(503)
  })

  it('returns a generic error when Fleeca fails unexpectedly', async () => {
    mocks.fleecaClient.createPayment.mockRejectedValue(new Error('boom'))

    const result = await createGiftOrder(validData)

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

    const result = await createGiftOrder(validData)

    expect(result).toEqual({
      success: false,
      error: 'Les informations de paiement sont invalides. Veuillez réessayer.',
    })
    expect(setResponseStatus).toHaveBeenCalledWith(400)
  })
})

describe('gift shop payment handler', () => {
  it('notifies Discord and deletes the payment on success', async () => {
    await createPendingPayment()
    mocks.fleecaClient.verifyWebhookSignature.mockReturnValue(true)

    const result = await paymentService.processWebhook({
      rawBody: JSON.stringify({
        payment_id: 'pay_1',
        payment_url: 'https://fleeca.example/pay_1',
        mode: 'sandbox',
        amount: 10_470,
        payer_routing: 'routing-1',
        payer_name: null,
        status: 'payment_successful',
        description: '',
        status_reason: '',
        created_at: '2026-08-05T14:00:00.000Z',
        paid_at: '2026-08-05T14:00:00.000Z',
      }),
      signature: 'sha256=x',
    })

    expect(result).toEqual({ status: 200, body: 'OK' })
    expect(mocks.sendGiftShopNotification).toHaveBeenCalledWith({
      items: [
        {
          productId: 'chapelet-lourdes',
          itemId: 3547,
          productName: 'Chapelet Notre-Dame de Lourdes',
          price: 5_095,
          quantity: 2,
        },
        {
          productId: 'plaque-priere-irlandaise',
          itemId: 6302,
          productName: 'Plaque Irlandaise',
          price: 280,
          quantity: 1,
        },
      ],
      title: 'mr',
      firstname: 'Jean',
      lastname: 'Valjean',
      phone: '123456',
      address: 'La Perla',
      reference: 'GC-AB2CD3EF4J',
      amount: 10_470,
    })
    await expect(pendingPaymentRepository.findById('pay_1')).resolves.toBeUndefined()
  })

  it('returns a 500 and restores the payment when the Discord notification fails', async () => {
    await createPendingPayment()
    mocks.fleecaClient.verifyWebhookSignature.mockReturnValue(true)
    mocks.sendGiftShopNotification.mockRejectedValueOnce(new Error('Failed to send'))

    const result = await paymentService.processWebhook({
      rawBody: JSON.stringify({
        payment_id: 'pay_1',
        payment_url: 'https://fleeca.example/pay_1',
        mode: 'sandbox',
        amount: 10_470,
        payer_routing: 'routing-1',
        payer_name: null,
        status: 'payment_successful',
        description: '',
        status_reason: '',
        created_at: '2026-08-05T14:00:00.000Z',
        paid_at: '2026-08-05T14:00:00.000Z',
      }),
      signature: 'sha256=x',
    })

    expect(result).toEqual({ status: 500, body: 'Internal Server Error' })
    const restored = await pendingPaymentRepository.findById('pay_1')
    expect(restored).toBeDefined()
    expect(decryptMetadata<GiftOrderMetadata>(restored!.metadata)).toMatchObject({
      reference: 'GC-AB2CD3EF4J',
      firstname: 'Jean',
    })
  })

  it('deletes the payment without notifying when the payment failed', async () => {
    await createPendingPayment()
    mocks.fleecaClient.verifyWebhookSignature.mockReturnValue(true)

    const result = await paymentService.processWebhook({
      rawBody: JSON.stringify({
        payment_id: 'pay_1',
        payment_url: 'https://fleeca.example/pay_1',
        mode: 'sandbox',
        amount: 10_470,
        payer_routing: 'routing-1',
        payer_name: null,
        status: 'payment_failed',
        description: '',
        status_reason: '',
        created_at: '2026-08-05T14:00:00.000Z',
        paid_at: '2026-08-05T14:00:00.000Z',
      }),
      signature: 'sha256=x',
    })

    expect(result).toEqual({ status: 200, body: 'OK' })
    expect(mocks.sendGiftShopNotification).not.toHaveBeenCalled()
    await expect(pendingPaymentRepository.findById('pay_1')).resolves.toBeUndefined()
  })
})
