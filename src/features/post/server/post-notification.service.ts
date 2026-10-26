import type { APIComponentInContainer, APIMessageTopLevelComponent } from 'discord-api-types/v10'
import {
  ButtonStyle,
  ComponentType,
  MessageFlags,
  SeparatorSpacingSize,
} from 'discord-api-types/v10'
import { env } from '#/config/env.server.ts'
import { logger } from '#server/integrations/logger.ts'
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
  excerpt: string
  bannerImg: string
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
        flags: MessageFlags.IsComponentsV2,
        components: buildPostComponents(data, true),
        allowed_mentions: { roles: [...NOTIFICATION_ROLE_IDS] },
      },
      wait: true,
      withComponents: true,
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
  excerpt,
  bannerImg,
  publishedAt,
}: {
  messageId: string
  title: string
  slug: string
  excerpt: string
  bannerImg: string
  publishedAt: Date | null
}): Promise<void> {
  const webhookUrl = env.POST_DISCORD_WEBHOOK
  if (!webhookUrl) return

  try {
    await editWebhookMessage({
      webhookUrl,
      messageId,
      withComponents: true,
      payload: {
        flags: MessageFlags.IsComponentsV2,
        components: buildPostComponents({ title, slug, excerpt, bannerImg, publishedAt }, false),
      },
    })
  } catch (err) {
    logger.error({ err, messageId }, 'Failed to edit post notification')
  }
}

function buildPostComponents(
  data: {
    title: string
    slug: string
    excerpt: string | null
    bannerImg: string
    publishedAt: Date | null
  },
  includeRoleMentions: boolean
): APIMessageTopLevelComponent[] {
  const appUrl = env.VITE_APP_URL
  const postUrl = `${appUrl}/post/${data.slug}`
  const publishedAt = data.publishedAt ?? new Date()
  const components: APIMessageTopLevelComponent[] = []

  if (includeRoleMentions) {
    components.push({ type: ComponentType.TextDisplay, content: ROLE_MENTIONS })
  }

  components.push({
    type: ComponentType.Container,
    accent_color: POST_EMBED_COLOR,
    components: [
      {
        type: ComponentType.TextDisplay,
        content: `Newsroom - Archidiocèse de Los Santos · <t:${Math.floor(publishedAt.getTime() / 1000)}:F>`,
      },
      {
        type: ComponentType.MediaGallery,
        items: [
          {
            media: { url: data.bannerImg },
          },
        ],
      },
      {
        type: ComponentType.Separator,
        spacing: SeparatorSpacingSize.Small,
      },
      {
        type: ComponentType.Section,
        components: [
          {
            type: ComponentType.TextDisplay,
            content: `# [${escapeDiscordMarkdown(data.title)}](${postUrl})`,
          },
        ],
        accessory: {
          type: ComponentType.Button,
          style: ButtonStyle.Link,
          label: 'Lire le communiqué',
          url: postUrl,
        },
      },
      ...(data.excerpt
        ? ([
            {
              type: ComponentType.Separator,
              spacing: SeparatorSpacingSize.Large,
            },
            {
              type: ComponentType.TextDisplay,
              content: escapeDiscordMarkdown(data.excerpt),
            },
          ] as APIComponentInContainer[])
        : []),
    ],
  })

  return components
}
