import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { POST_EMBED_COLOR } from '#/features/post/server/post-notification.service.ts'

const mocks = vi.hoisted(() => {
  let webhook: string | undefined = 'https://discord.com/api/webhooks/test/token'
  return {
    sendWebhookMessage: vi.fn(),
    editWebhookMessage: vi.fn(),
    deleteWebhookMessage: vi.fn(),
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
  Object.defineProperty(env, 'POST_DISCORD_WEBHOOK', {
    enumerable: true,
    configurable: true,
    get: () => mocks.getWebhook(),
  })
  Object.defineProperty(env, 'VITE_APP_URL', {
    enumerable: true,
    configurable: true,
    get: () => 'https://app.example.com',
  })
  return { env }
})

vi.mock('#server/services/discord.service.ts', () => ({
  sendWebhookMessage: mocks.sendWebhookMessage,
  editWebhookMessage: mocks.editWebhookMessage,
  deleteWebhookMessage: mocks.deleteWebhookMessage,
  escapeDiscordMarkdown: (value: string) => value,
}))

const mockDate = new Date('2026-08-05T14:09:05.100Z')

beforeEach(() => {
  vi.useFakeTimers()
  vi.setSystemTime(mockDate)
  mocks.setWebhook('https://discord.com/api/webhooks/test/token')
  mocks.sendWebhookMessage.mockReset()
  mocks.editWebhookMessage.mockReset()
  mocks.deleteWebhookMessage.mockReset()
})

afterEach(() => {
  vi.useRealTimers()
})

describe('sendPostNotification', () => {
  it('sends the notification with role mentions and embed', async () => {
    mocks.sendWebhookMessage.mockResolvedValue({ id: 'msg-1' })
    const { sendPostNotification } =
      await import('#/features/post/server/post-notification.service.ts')

    const result = await sendPostNotification({
      title: 'Test Post',
      slug: 'test-post',
      publishedAt: mockDate,
    })

    expect(result).toBe('msg-1')
    expect(mocks.sendWebhookMessage).toHaveBeenCalledWith({
      url: 'https://discord.com/api/webhooks/test/token',
      payload: {
        content: '<@&1071282875976126506> <@&1254316102805098526>',
        embeds: [
          {
            title: 'Test Post',
            color: POST_EMBED_COLOR,
            url: 'https://app.example.com/post/test-post',
            author: {
              name: 'Newsroom - Archidiocèse de Los Santos',
              icon_url: 'https://i.imgur.com/6YJtfqY.png',
            },
            thumbnail: { url: 'https://i.imgur.com/6YJtfqY.png' },
            timestamp: mockDate.toISOString(),
          },
        ],
        allowed_mentions: {
          roles: ['1071282875976126506', '1254316102805098526'],
        },
      },
      wait: true,
    })
  })

  it('returns null when the webhook is not configured', async () => {
    mocks.setWebhook(undefined)
    const { sendPostNotification } =
      await import('#/features/post/server/post-notification.service.ts')

    const result = await sendPostNotification({
      title: 'Test Post',
      slug: 'test-post',
      publishedAt: null,
    })

    expect(result).toBeNull()
    expect(mocks.sendWebhookMessage).not.toHaveBeenCalled()
  })

  it('returns null and does not throw when the webhook request fails', async () => {
    mocks.sendWebhookMessage.mockRejectedValue(new Error('network error'))
    const { sendPostNotification } =
      await import('#/features/post/server/post-notification.service.ts')

    const result = await sendPostNotification({
      title: 'Test Post',
      slug: 'test-post',
      publishedAt: null,
    })

    expect(result).toBeNull()
  })

  it('uses the current date when publishedAt is null', async () => {
    mocks.sendWebhookMessage.mockResolvedValue({ id: 'msg-2' })
    const { sendPostNotification } =
      await import('#/features/post/server/post-notification.service.ts')

    await sendPostNotification({
      title: 'Draft Post',
      slug: 'draft-post',
      publishedAt: null,
    })

    expect(mocks.sendWebhookMessage).toHaveBeenCalledWith(
      expect.objectContaining({
        payload: expect.objectContaining({
          embeds: [
            expect.objectContaining({
              timestamp: mockDate.toISOString(),
            }),
          ],
        }),
      })
    )
  })
})

describe('editPostNotification', () => {
  it('edits the existing message with updated embed', async () => {
    const { editPostNotification } =
      await import('#/features/post/server/post-notification.service.ts')

    await editPostNotification({
      messageId: 'msg-1',
      title: 'Updated Title',
      slug: 'updated-slug',
      publishedAt: mockDate,
    })

    expect(mocks.editWebhookMessage).toHaveBeenCalledWith({
      webhookUrl: 'https://discord.com/api/webhooks/test/token',
      messageId: 'msg-1',
      payload: {
        embeds: [
          {
            title: 'Updated Title',
            color: POST_EMBED_COLOR,
            url: 'https://app.example.com/post/updated-slug',
            author: {
              name: 'Newsroom - Archidiocèse de Los Santos',
              icon_url: 'https://i.imgur.com/6YJtfqY.png',
            },
            thumbnail: { url: 'https://i.imgur.com/6YJtfqY.png' },
            timestamp: mockDate.toISOString(),
          },
        ],
      },
    })
  })

  it('does nothing when the webhook is not configured', async () => {
    mocks.setWebhook(undefined)
    const { editPostNotification } =
      await import('#/features/post/server/post-notification.service.ts')

    await editPostNotification({
      messageId: 'msg-1',
      title: 'Title',
      slug: 'slug',
      publishedAt: null,
    })

    expect(mocks.editWebhookMessage).not.toHaveBeenCalled()
  })

  it('does not throw when the edit request fails', async () => {
    mocks.editWebhookMessage.mockRejectedValue(new Error('boom'))
    const { editPostNotification } =
      await import('#/features/post/server/post-notification.service.ts')

    await expect(
      editPostNotification({
        messageId: 'msg-1',
        title: 'Title',
        slug: 'slug',
        publishedAt: null,
      })
    ).resolves.toBeUndefined()
  })
})

describe('deletePostNotification', () => {
  it('deletes the message by id', async () => {
    const { deletePostNotification } =
      await import('#/features/post/server/post-notification.service.ts')

    await deletePostNotification({ messageId: 'msg-1' })

    expect(mocks.deleteWebhookMessage).toHaveBeenCalledWith({
      webhookUrl: 'https://discord.com/api/webhooks/test/token',
      messageId: 'msg-1',
    })
  })

  it('does nothing when the webhook is not configured', async () => {
    mocks.setWebhook(undefined)
    const { deletePostNotification } =
      await import('#/features/post/server/post-notification.service.ts')

    await deletePostNotification({ messageId: 'msg-1' })

    expect(mocks.deleteWebhookMessage).not.toHaveBeenCalled()
  })

  it('does not throw when the delete request fails', async () => {
    mocks.deleteWebhookMessage.mockRejectedValue(new Error('boom'))
    const { deletePostNotification } =
      await import('#/features/post/server/post-notification.service.ts')

    await expect(deletePostNotification({ messageId: 'msg-1' })).resolves.toBeUndefined()
  })
})
