import { env } from '#/config/env.server.ts'
import { logger } from '#server/integrations/logger.ts'
import type { DiscordEmbed } from '#server/services/discord.service.ts'
import {
  deleteWebhookMessage,
  editWebhookMessage,
  escapeDiscordMarkdown,
  sendWebhookMessage,
} from '#server/services/discord.service.ts'

export const POST_EMBED_COLOR = 0x977d17

const NOTIFICATION_ROLE_IDS = ['1071282875976126506', '1254316102805098526'] as const
const ROLE_MENTIONS = NOTIFICATION_ROLE_IDS.map((id) => `<@&${id}>`).join(' ')

export async function sendPostNotification(data: {
  title: string
  slug: string
  publishedAt: Date | null
}): Promise<string | null> {
  const webhookUrl = env.POST_DISCORD_WEBHOOK
  if (!webhookUrl) {
    logger.error(
      { title: data.title },
      '[Post] Failed to send discord notification. POST_DISCORD_WEBHOOK is not configured'
    )
    return null
  }

  try {
    const response = await sendWebhookMessage({
      url: webhookUrl,
      payload: {
        content: ROLE_MENTIONS,
        embeds: [buildPostEmbed(data)],
        allowed_mentions: { roles: [...NOTIFICATION_ROLE_IDS] },
      },
      wait: true,
    })

    return response?.id ?? null
  } catch (err) {
    logger.error({ err, title: data.title }, 'Failed to send post notification')
    return null
  }
}

export async function deletePostNotification({ messageId }: { messageId: string }): Promise<void> {
  const webhookUrl = env.POST_DISCORD_WEBHOOK
  if (!webhookUrl) return

  try {
    await deleteWebhookMessage({ webhookUrl, messageId })
  } catch (err) {
    logger.error({ err, messageId }, 'Failed to delete post notification')
  }
}

export async function editPostNotification({
  messageId,
  title,
  slug,
  publishedAt,
}: {
  messageId: string
  title: string
  slug: string
  publishedAt: Date | null
}): Promise<void> {
  const webhookUrl = env.POST_DISCORD_WEBHOOK
  if (!webhookUrl) return

  try {
    await editWebhookMessage({
      webhookUrl,
      messageId,
      payload: { embeds: [buildPostEmbed({ title, slug, publishedAt })] },
    })
  } catch (err) {
    logger.error({ err, messageId }, 'Failed to edit post notification')
  }
}

function buildPostEmbed(data: {
  title: string
  slug: string
  publishedAt: Date | null
}): DiscordEmbed {
  const appUrl = env.VITE_APP_URL
  const postUrl = `${appUrl}/post/${data.slug}`

  return {
    title: escapeDiscordMarkdown(data.title),
    color: POST_EMBED_COLOR,
    url: postUrl,
    author: {
      name: 'Newsroom - Archidiocèse de Los Santos',
      icon_url: 'https://i.imgur.com/6YJtfqY.png',
    },
    thumbnail: { url: 'https://i.imgur.com/6YJtfqY.png' },
    timestamp: data.publishedAt ? data.publishedAt.toISOString() : new Date().toISOString(),
  }
}
