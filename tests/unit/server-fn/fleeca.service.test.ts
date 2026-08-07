import { createHmac } from 'node:crypto'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const hoisted = vi.hoisted(() => {
  const post = vi.fn()
  const get = vi.fn()
  return {
    createMock: vi.fn(() => ({ post, get })),
    post,
    get,
  }
})

vi.mock('ky', () => ({
  default: { create: hoisted.createMock, post: hoisted.post },
  isHTTPError: (err: unknown) => (err as { isHTTPError?: boolean } | null)?.isHTTPError === true,
  isNetworkError: (err: unknown) =>
    (err as { isNetworkError?: boolean } | null)?.isNetworkError === true,
  isTimeoutError: (err: unknown) =>
    (err as { isTimeoutError?: boolean } | null)?.isTimeoutError === true,
}))

const API_KEY = 'test-hmac-secret'
const UUID = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'

function sign(rawBody: string, key = API_KEY): string {
  return `sha256=${createHmac('sha256', key).update(rawBody).digest('hex')}`
}

beforeEach(() => {
  vi.stubEnv('FLEECA_API_KEY', API_KEY)
  vi.resetModules()
})

afterEach(() => {
  vi.unstubAllEnvs()
})

describe('verifyWebhookSignature', () => {
  it('accepts a valid HMAC signature', async () => {
    const { fleecaClient } = await import('#server/services/fleeca.service.ts')
    const rawBody = JSON.stringify({ payment_id: 'pay_1', status: 'payment_successful' })

    expect(fleecaClient.verifyWebhookSignature(rawBody, sign(rawBody))).toBe(true)
  })

  it('rejects a signature computed with a different key', async () => {
    const { fleecaClient } = await import('#server/services/fleeca.service.ts')
    const rawBody = JSON.stringify({ payment_id: 'pay_1' })

    expect(fleecaClient.verifyWebhookSignature(rawBody, sign(rawBody, 'wrong-key'))).toBe(false)
  })

  it('rejects a signature that does not start with "sha256="', async () => {
    const { fleecaClient } = await import('#server/services/fleeca.service.ts')
    const rawBody = JSON.stringify({ payment_id: 'pay_1' })

    expect(fleecaClient.verifyWebhookSignature(rawBody, 'deadbeef')).toBe(false)
  })

  it('rejects a tampered body', async () => {
    const { fleecaClient } = await import('#server/services/fleeca.service.ts')
    const rawBody = JSON.stringify({ payment_id: 'pay_1', amount: 500 })

    expect(
      fleecaClient.verifyWebhookSignature(rawBody, sign(JSON.stringify({ payment_id: 'pay_1' })))
    ).toBe(false)
  })

  it('always returns false when no API key is configured', async () => {
    vi.stubEnv('FLEECA_API_KEY', '')
    vi.resetModules()
    const { fleecaClient } = await import('#server/services/fleeca.service.ts')
    const rawBody = JSON.stringify({ payment_id: 'pay_1' })

    expect(fleecaClient.verifyWebhookSignature(rawBody, sign(rawBody))).toBe(false)
  })
})

describe('createPayment', () => {
  it('creates a payment through the Fleeca API', async () => {
    const { fleecaClient } = await import('#server/services/fleeca.service.ts')
    hoisted.post.mockImplementation(() => ({
      json: () => ({
        success: true,
        payment_id: UUID,
        payment_link: `https://fleeca.example/${UUID}`,
        message: 'ok',
      }),
    }))

    const result = await fleecaClient.createPayment({
      amount: 500,
      mode: 0,
      description: 'Don — Jean Valjean',
    })

    expect(result).toEqual({
      success: true,
      payment_id: UUID,
      payment_link: `https://fleeca.example/${UUID}`,
      message: 'ok',
    })
    expect(hoisted.createMock).toHaveBeenCalledWith(
      expect.objectContaining({
        prefix: 'https://fleeca.gta.world/api/v2',
        headers: expect.objectContaining({ Authorization: `Bearer ${API_KEY}` }),
      })
    )
    expect(hoisted.post).toHaveBeenCalledWith('payment', {
      json: { amount: 500, mode: 0, description: 'Don — Jean Valjean' },
    })
  })

  it('throws a UNCONFIGURED error when no API key is set', async () => {
    vi.stubEnv('FLEECA_API_KEY', '')
    vi.resetModules()
    const { fleecaClient } = await import('#server/services/fleeca.service.ts')

    await expect(fleecaClient.createPayment({ amount: 500, mode: 0 })).rejects.toMatchObject({
      name: 'FleecaClientError',
      code: 'UNCONFIGURED',
    })
  })

  it('maps a network error to a NETWORK FleecaClientError', async () => {
    const { fleecaClient, FleecaClientError } = await import('#server/services/fleeca.service.ts')
    hoisted.post.mockImplementation(() => ({
      json: () => Promise.reject({ isNetworkError: true }),
    }))

    await expect(fleecaClient.createPayment({ amount: 500, mode: 0 })).rejects.toMatchObject({
      code: 'NETWORK',
    })
    await expect(fleecaClient.createPayment({ amount: 500, mode: 0 })).rejects.toBeInstanceOf(
      FleecaClientError
    )
  })

  it('maps an HTTP error to a HTTP FleecaClientError', async () => {
    const { fleecaClient } = await import('#server/services/fleeca.service.ts')
    hoisted.post.mockImplementation(() => ({
      json: () => Promise.reject({ isHTTPError: true, response: { status: 422 } }),
    }))

    await expect(fleecaClient.createPayment({ amount: 500, mode: 0 })).rejects.toMatchObject({
      code: 'HTTP',
    })
  })

  it('maps an unknown error to a PROCESSING FleecaClientError', async () => {
    const { fleecaClient } = await import('#server/services/fleeca.service.ts')
    hoisted.post.mockImplementation(() => ({
      json: () => Promise.reject(new Error('boom')),
    }))

    await expect(fleecaClient.createPayment({ amount: 500, mode: 0 })).rejects.toMatchObject({
      code: 'PROCESSING',
    })
  })
})

describe('getPayment', () => {
  it('returns the payment details from the API response', async () => {
    const { fleecaClient } = await import('#server/services/fleeca.service.ts')
    hoisted.get.mockImplementation(() => ({
      json: () => ({
        success: true,
        data: {
          payment_id: UUID,
          merchant_id: 42,
          amount: 500,
          description: 'Don — Jean Valjean',
          status: 'payment_successful',
          mode: 'sandbox',
          payer_routing: 'routing-1',
          payer_name: 'Jean Valjean',
          paid_at: '2026-08-05T14:00:00.000Z',
          created_at: '2026-08-05T13:59:00.000Z',
          updated_at: '2026-08-05T14:00:00.000Z',
        },
      }),
    }))

    const result = await fleecaClient.getPayment(UUID)

    expect(result).toEqual({
      payment_id: UUID,
      merchant_id: 42,
      amount: 500,
      description: 'Don — Jean Valjean',
      status: 'payment_successful',
      mode: 'sandbox',
      payer_routing: 'routing-1',
      payer_name: 'Jean Valjean',
      paid_at: '2026-08-05T14:00:00.000Z',
      created_at: '2026-08-05T13:59:00.000Z',
      updated_at: '2026-08-05T14:00:00.000Z',
    })
    expect(hoisted.get).toHaveBeenCalledWith(`payments/${UUID}`)
  })

  it('throws a PROCESSING error when the API response has no data', async () => {
    const { fleecaClient, FleecaClientError } = await import('#server/services/fleeca.service.ts')
    hoisted.get.mockImplementation(() => ({
      json: () => ({ success: false }),
    }))

    await expect(fleecaClient.getPayment(UUID)).rejects.toBeInstanceOf(FleecaClientError)
    await expect(fleecaClient.getPayment(UUID)).rejects.toMatchObject({ code: 'PROCESSING' })
  })

  it('maps an HTTP error to a HTTP FleecaClientError', async () => {
    const { fleecaClient } = await import('#server/services/fleeca.service.ts')
    hoisted.get.mockImplementation(() => ({
      json: () => Promise.reject({ isHTTPError: true, response: { status: 500 } }),
    }))

    await expect(fleecaClient.getPayment(UUID)).rejects.toMatchObject({ code: 'HTTP' })
  })

  it('exposes the HTTP status on the mapped error', async () => {
    const { fleecaClient } = await import('#server/services/fleeca.service.ts')
    hoisted.get.mockImplementation(() => ({
      json: () => Promise.reject({ isHTTPError: true, response: { status: 404 } }),
    }))

    await expect(fleecaClient.getPayment(UUID)).rejects.toMatchObject({
      code: 'HTTP',
      status: 404,
    })
  })

  it.each(['../balance', '..%2Fbalance', 'foo/bar', 'foo?x=1', 'foo#bar', 'a'.repeat(65), ''])(
    'rejects the unsafe payment id "%s" before calling the API',
    async (paymentId) => {
      const { fleecaClient } = await import('#server/services/fleeca.service.ts')

      await expect(fleecaClient.getPayment(paymentId)).rejects.toMatchObject({
        code: 'INVALID_PAYMENT_ID',
      })
      expect(hoisted.get).not.toHaveBeenCalled()
    }
  )
})
