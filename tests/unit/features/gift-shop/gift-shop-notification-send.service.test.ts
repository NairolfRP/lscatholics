import { beforeEach, describe, expect, it, vi } from 'vitest'
import { sendGiftShopNotification } from '#/features/gift-shop/server/gift-shop-notification.service.ts'
import type { GiftOrderNotificationData } from '#/features/gift-shop/types/gift-shop.types.ts'

const mocks = vi.hoisted(() => {
  let webhook: string | undefined = 'https://discord.example/gift-shop'
  return {
    sendWebhookMessage: vi.fn(() => undefined),
    setWebhook(value: string | undefined) {
      webhook = value
    },
    getWebhook() {
      return webhook
    },
  }
})

vi.mock('#/config/env.server.ts', async (importOriginal) => {
  const original = await importOriginal<{ env: Record<string, unknown> }>()
  const env: Record<string, unknown> = Object.create(original.env)
  Object.defineProperty(env, 'GIFT_SHOP_NOTIFICATION_WEBHOOK', {
    enumerable: true,
    configurable: true,
    get: () => mocks.getWebhook(),
  })
  return { env }
})

vi.mock('#server/services/discord.service.ts', () => ({
  sendWebhookMessage: mocks.sendWebhookMessage,
  escapeDiscordMarkdown: (value: string) => value,
}))

const DATA: GiftOrderNotificationData = {
  reference: 'GC-AB2CD3EF4J',
  title: 'mr',
  firstname: 'Edmund',
  lastname: 'Hennessy',
  phone: '777',
  address: '123 test',
  items: [
    {
      productId: 'product-2633',
      itemId: 2633,
      productName: 'Statuette Saint François d’Assise',
      price: 500,
      quantity: 1,
    },
  ],
  amount: 500,
}

beforeEach(() => {
  mocks.setWebhook('https://discord.example/gift-shop')
  mocks.sendWebhookMessage.mockReset()
})

describe('sendGiftShopNotification', () => {
  it('sends the message with mentions disabled', async () => {
    await sendGiftShopNotification(DATA)

    expect(mocks.sendWebhookMessage).toHaveBeenCalledTimes(1)
    expect(mocks.sendWebhookMessage).toHaveBeenCalledWith({
      url: 'https://discord.example/gift-shop',
      payload: expect.objectContaining({
        allowed_mentions: { parse: [] },
        embeds: expect.any(Array),
      }),
    })
  })

  it('does nothing when the webhook is not configured', async () => {
    mocks.setWebhook(undefined)

    await expect(sendGiftShopNotification(DATA)).resolves.toBeUndefined()
    expect(mocks.sendWebhookMessage).not.toHaveBeenCalled()
  })

  it('rejects with a sanitized error (no webhook URL) when Discord fails', async () => {
    mocks.sendWebhookMessage.mockRejectedValue(
      new Error('POST https://discord.example/gift-shop returned 403')
    )

    await expect(sendGiftShopNotification(DATA)).rejects.toThrow(
      'Failed to send gift shop notification'
    )
    await expect(sendGiftShopNotification(DATA)).rejects.toSatisfy((err: unknown) => {
      return err instanceof Error && !err.message.includes('discord.example')
    }, 'thrown error must not embed the webhook URL')
  })
})
