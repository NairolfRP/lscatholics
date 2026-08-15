import { beforeEach, describe, expect, it, vi } from 'vitest'
import { DONATION_SOURCE } from '#/features/donate/constants/donate.constants.ts'
import type { DonationMetadata } from '#/features/donate/types/donate.types.ts'
import { notFoundCache } from '#server/payments/not-found-cache.ts'
import { encryptMetadata } from '#server/payments/payment-crypto.service.ts'
import { paymentHandlerRegistry } from '#server/payments/payment-handler.ts'
import { pendingPaymentRepository } from '#server/repositories/pending-payment.repository.ts'
import cleanupTask from '#server/tasks/cleanup.ts'

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
    sendPrivateDonationNotification: vi.fn(async () => {}),
    sendPublicDonationNotification: vi.fn(async () => {}),
  }
})

vi.mock('#server/services/fleeca.service.ts', () => ({
  FleecaClientError: mocks.FleecaClientError,
  fleecaClient: mocks.fleecaClient,
  FLEECA_PAYMENT_MODE: { SANDBOX: 0, LIVE: 1 },
}))

vi.mock('#/features/donate/server/donation-notification.service.ts', () => ({
  sendPrivateDonationNotification: mocks.sendPrivateDonationNotification,
  sendPublicDonationNotification: mocks.sendPublicDonationNotification,
}))

vi.mock('nitro/task', () => ({
  defineTask: (definition: { run: () => unknown }) => definition,
}))

beforeEach(() => {
  notFoundCache.clear()
  mocks.sendPrivateDonationNotification.mockClear()
  mocks.fleecaClient.getPayment.mockReset()
})

describe('cleanup task', () => {
  it('registers the donation payment handler via its module side-effect', () => {
    expect(paymentHandlerRegistry.has(DONATION_SOURCE)).toBe(true)
  })

  it('processes a late-successful expired donation during reconciliation', async () => {
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
      message: '',
      anonymous: false,
    }

    await pendingPaymentRepository.create({
      id: 'pay_1',
      source: DONATION_SOURCE,
      amount: 500,
      mode: 1,
      metadata: encryptMetadata(metadata),
      expiresAt: new Date(Date.now() - 60_000),
    })
    mocks.fleecaClient.getPayment.mockResolvedValue({
      payment_id: 'pay_1',
      status: 'payment_successful',
      amount: 500,
    })

    await (cleanupTask.run as () => Promise<unknown>)()

    expect(mocks.sendPrivateDonationNotification).toHaveBeenCalledWith(
      expect.objectContaining({ firstname: 'Jean', amount: 500 })
    )
    await expect(pendingPaymentRepository.findById('pay_1')).resolves.toBeUndefined()
  })
})
