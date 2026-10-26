import {
  ButtonStyle,
  ComponentType,
  MessageFlags,
  SeparatorSpacingSize,
} from 'discord-api-types/v10'
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
const postData = {
  title: 'Test Post',
  slug: 'test-post',
  excerpt: 'A test excerpt',
  bannerImg: 'https://cdn.example.com/banner.png',
  publishedAt: mockDate,
}

function expectedPostComponents({
  includeRoleMentions = true,
  excerpt = postData.excerpt,
  slug = postData.slug,
  title = postData.title,
}: {
  includeRoleMentions?: boolean
  excerpt?: string | null
  slug?: string
  title?: string
} = {}) {
  return [
    ...(includeRoleMentions
      ? [
          {
            type: ComponentType.TextDisplay,
            content: '<@&1071282875976126506> <@&1254316102805098526>',
          },
        ]
      : []),
    {
      type: ComponentType.Container,
      accent_color: POST_EMBED_COLOR,
      components: [
        {
          type: ComponentType.TextDisplay,
          content: 'Newsroom - Archidiocèse de Los Santos · <t:1785938945:F>',
        },
        {
          type: ComponentType.MediaGallery,
          items: [{ media: { url: 'https://cdn.example.com/banner.png' } }],
        },
        { type: ComponentType.Separator, spacing: SeparatorSpacingSize.Small },
        {
          type: ComponentType.Section,
          components: [
            {
              type: ComponentType.TextDisplay,
              content: `# [${title}](https://app.example.com/post/${slug})`,
            },
          ],
          accessory: {
            type: ComponentType.Button,
            style: ButtonStyle.Link,
            label: 'Lire le communiqué',
            url: `https://app.example.com/post/${slug}`,
          },
        },
        ...(excerpt
          ? [
              { type: ComponentType.Separator, spacing: SeparatorSpacingSize.Large },
              { type: ComponentType.TextDisplay, content: excerpt },
            ]
          : []),
      ],
    },
  ]
}

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
  it('sends the Components V2 notification with role mentions', async () => {
    mocks.sendWebhookMessage.mockResolvedValue({ id: 'msg-1' })
    const { sendPostNotification } =
      await import('#/features/post/server/post-notification.service.ts')

    const result = await sendPostNotification(postData)

    expect(result).toBe('msg-1')
    expect(mocks.sendWebhookMessage).toHaveBeenCalledWith({
      url: 'https://discord.com/api/webhooks/test/token',
      payload: {
        flags: MessageFlags.IsComponentsV2,
        components: expectedPostComponents(),
        allowed_mentions: {
          roles: ['1071282875976126506', '1254316102805098526'],
        },
      },
      wait: true,
      withComponents: true,
    })
  })

  it('returns null when the webhook is not configured', async () => {
    mocks.setWebhook(undefined)
    const { sendPostNotification } =
      await import('#/features/post/server/post-notification.service.ts')

    const result = await sendPostNotification({
      title: 'Test Post',
      slug: 'test-post',
      excerpt: 'A test excerpt',
      bannerImg: 'https://cdn.example.com/banner.png',
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
      excerpt: 'A test excerpt',
      bannerImg: 'https://cdn.example.com/banner.png',
      publishedAt: null,
    })

    expect(result).toBeNull()
  })

  it('uses the current date when publishedAt is null', async () => {
    mocks.sendWebhookMessage.mockResolvedValue({ id: 'msg-2' })
    const { sendPostNotification } =
      await import('#/features/post/server/post-notification.service.ts')

    await sendPostNotification({
      ...postData,
      title: 'Draft Post',
      publishedAt: null,
    })

    expect(mocks.sendWebhookMessage).toHaveBeenCalledWith(
      expect.objectContaining({
        payload: expect.objectContaining({
          components: expectedPostComponents({ title: 'Draft Post' }),
        }),
      })
    )
  })
})

describe('editPostNotification', () => {
  it('edits the existing message with updated Components V2 content', async () => {
    const { editPostNotification } =
      await import('#/features/post/server/post-notification.service.ts')

    await editPostNotification({
      messageId: 'msg-1',
      title: 'Updated Title',
      slug: 'updated-slug',
      excerpt: postData.excerpt,
      bannerImg: postData.bannerImg,
      publishedAt: mockDate,
    })

    expect(mocks.editWebhookMessage).toHaveBeenCalledWith({
      webhookUrl: 'https://discord.com/api/webhooks/test/token',
      messageId: 'msg-1',
      withComponents: true,
      payload: {
        flags: MessageFlags.IsComponentsV2,
        components: expectedPostComponents({
          includeRoleMentions: false,
          title: 'Updated Title',
          slug: 'updated-slug',
        }),
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
      excerpt: postData.excerpt,
      bannerImg: postData.bannerImg,
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
        excerpt: postData.excerpt,
        bannerImg: postData.bannerImg,
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
