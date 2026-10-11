import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  GIFT_ORDER_CONFIRMATION_MAIL_SUBJECT,
  sendGiftOrderConfirmationMail,
} from '#/features/gift-shop/server/gift-shop-mail.service.ts'
import type { GiftOrderNotificationData } from '#/features/gift-shop/types/gift-shop.types.ts'

const mocks = vi.hoisted(() => {
  class EyefindMailError extends Error {
    constructor(
      message: string,
      readonly code: string,
      readonly status?: number
    ) {
      super(message)
      this.name = 'EyefindMailError'
    }
  }

  return {
    sendEyefindMail: vi.fn(),
    EyefindMailError,
  }
})

vi.mock('#server/services/eyefind-mail.service.ts', () => ({
  sendEyefindMail: mocks.sendEyefindMail,
  EyefindMailError: mocks.EyefindMailError,
}))

const validData: GiftOrderNotificationData = {
  reference: 'GC-AB2CD3EF4J',
  title: 'mr',
  firstname: 'Jean',
  lastname: 'Valjean',
  phone: '123456',
  eyefindMail: 'jean.valjean@mail.eyefind.fr',
  address: 'La Perla',
  items: [
    {
      productId: 'chapelet-lourdes',
      itemId: 3547,
      productName: 'Chapelet Notre-Dame de Lourdes',
      price: 5_095,
      quantity: 2,
    },
  ],
  amount: 10_190,
}

beforeEach(() => {
  mocks.sendEyefindMail.mockReset()
})

describe('sendGiftOrderConfirmationMail', () => {
  it('does nothing when no EyefindMail address was provided', async () => {
    await sendGiftOrderConfirmationMail({ ...validData, eyefindMail: undefined })

    expect(mocks.sendEyefindMail).not.toHaveBeenCalled()
  })

  it('sends the order recap to the given EyefindMail address', async () => {
    mocks.sendEyefindMail.mockResolvedValue({ messageId: 1, warnings: [] })

    await sendGiftOrderConfirmationMail(validData)

    expect(mocks.sendEyefindMail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'jean.valjean@mail.eyefind.fr',
        subject: GIFT_ORDER_CONFIRMATION_MAIL_SUBJECT,
      })
    )

    const payload = mocks.sendEyefindMail.mock.calls[0][0] as { body: string; html: string }
    expect(payload.body).toContain('Bonjour Jean Valjean')
    expect(payload.body).toContain('GC-AB2CD3EF4J')
    expect(payload.body).toContain('Chapelet Notre-Dame de Lourdes × 2')
    expect(payload.body).toContain('La Perla')
    expect(payload.html).toContain('Bonjour <strong>Jean Valjean</strong>,</p>')
    expect(payload.html).toContain('GC-AB2CD3EF4J')
    expect(payload.html).toContain('Chapelet Notre-Dame de Lourdes')
    expect(payload.html).toContain('La Perla')
    expect(payload.html).toContain('https://i.imgur.com/6YJtfqY.png')
    expect(payload.html).toContain('https://lscatholics.vercel.app')
    expect(payload.html).toContain('https://face-fr.gta.world/page/lscatholics')
  })

  it('escapes user content embedded in the html', async () => {
    mocks.sendEyefindMail.mockResolvedValue({ messageId: 1, warnings: [] })

    await sendGiftOrderConfirmationMail({
      ...validData,
      firstname: '</strong><script>alert(1)</script>',
    })

    const payload = mocks.sendEyefindMail.mock.calls[0][0] as { html: string }
    expect(payload.html).not.toContain('<script>')
    expect(payload.html).toContain('&lt;/strong&gt;')
  })

  it('swallows Eyefind errors so the order flow is not affected', async () => {
    mocks.sendEyefindMail.mockRejectedValue(
      new mocks.EyefindMailError('rate limited', 'rate_limited', 429)
    )

    await expect(sendGiftOrderConfirmationMail(validData)).resolves.toBeUndefined()
  })
})
