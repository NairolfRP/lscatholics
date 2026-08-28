import { env } from '#/config/env.server.ts'
import type { GiftOrderNotificationData } from '#/features/gift-shop/types/gift-shop.types.ts'
import { formatCurrency } from '#/utils/number.ts'
import { logger } from '#server/integrations/logger.ts'
import type { DiscordEmbed } from '#server/services/discord.service.ts'
import { sendWebhookMessage } from '#server/services/discord.service.ts'
import { civilTitleLabels } from '#shared/constants/civil-title.ts'

export const GIFT_SHOP_EMBED_COLOR = 0x8b0000

const EMBED_DESCRIPTION_LIMIT = 4096
const EMBEDS_PER_MESSAGE_LIMIT = 10

const NOTIFICATION_FAILURE_MESSAGE = 'Failed to send gift shop notification'

export async function sendGiftShopNotification(data: GiftOrderNotificationData): Promise<void> {
  const webhookUrl = env.GIFT_SHOP_NOTIFICATION_WEBHOOK
  if (!webhookUrl) {
    logger.error(
      { data },
      '[GiftShop] Failed to send discord notification. GIFT_SHOP_NOTIFICATION_WEBHOOK is not configured'
    )
    return
  }

  const embeds = buildGiftShopNotificationEmbeds(data)

  try {
    for (let offset = 0; offset < embeds.length; offset += EMBEDS_PER_MESSAGE_LIMIT) {
      await sendWebhookMessage({
        url: webhookUrl,
        payload: {
          embeds: embeds.slice(offset, offset + EMBEDS_PER_MESSAGE_LIMIT),
          allowed_mentions: { parse: [] },
        },
      })
    }
  } catch (err) {
    logger.error(
      {
        amount: data.amount,
        status: getHttpStatus(err),
        reason: err instanceof Error ? err.name : undefined,
      },
      NOTIFICATION_FAILURE_MESSAGE
    )
    // Rethrow without the original error (which embeds the webhook URL).
    // The payment handler restores the pending payment so Fleeca retries the
    // webhook, instead of silently losing the order.
    throw new Error(NOTIFICATION_FAILURE_MESSAGE)
  }
}

function getHttpStatus(err: unknown): number | undefined {
  if (err && typeof err === 'object' && 'response' in err) {
    const { response } = err as { response?: { status?: unknown } }
    if (response && typeof response.status === 'number') return response.status
  }
  return undefined
}

/** Escape Discord markdown so user-supplied values render as plain text. */
function escapeDiscordMarkdown(value: string): string {
  return value.replace(/([\\`*_~|<>])/g, '\\$1')
}

export function buildGiftShopNotificationEmbeds(data: GiftOrderNotificationData): DiscordEmbed[] {
  const headerLines = [
    `**Référence** : ${data.reference}`,
    `**Identité** : ${civilTitleLabels[data.title]} ${escapeDiscordMarkdown(data.firstname)} ${escapeDiscordMarkdown(data.lastname)}`,
    `**Adresse** : ${escapeDiscordMarkdown(data.address)}`,
  ]

  if (data.phone) {
    headerLines.push(`**Téléphone** : ${escapeDiscordMarkdown(data.phone)}`)
  }

  const footerLine = `**Montant** : ${formatCurrency(data.amount)}`
  const firstPrefix = headerLines.join('\n') + '\n\n**Articles** :\n'
  const continuationPrefix = '**Articles (suite)** :\n'
  const footer = '\n\n' + footerLine

  const articleLines = data.items.map(
    (item) =>
      `- **${item.productName}** × ${item.quantity} (#${item.itemId}) — ${formatCurrency(item.price * item.quantity)}`
  )

  const chunks: string[][] = [[]]
  let budget = EMBED_DESCRIPTION_LIMIT - firstPrefix.length - footer.length

  for (const line of articleLines) {
    const chunk = chunks[chunks.length - 1]
    const chunkSize = chunk.reduce((sum, item) => sum + item.length + 1, 0)

    if (chunk.length > 0 && chunkSize + line.length > budget) {
      chunks.push([])
      budget = EMBED_DESCRIPTION_LIMIT - continuationPrefix.length
    }

    chunks[chunks.length - 1].push(line)
  }

  const timestamp = new Date().toISOString()

  return chunks.map((chunk, index) => ({
    title: 'Nouvelle commande boutique !',
    color: GIFT_SHOP_EMBED_COLOR,
    timestamp,
    description:
      index === 0 ? firstPrefix + chunk.join('\n') + footer : continuationPrefix + chunk.join('\n'),
  }))
}
