import { env } from '#/config/env.server.ts'
import type { DonationNotificationData } from '#/features/donate/types/donate.types.ts'
import { formatCurrency } from '#/utils/number.ts'
import { logger } from '#server/integrations/logger.ts'
import type { DiscordEmbed } from '#server/services/discord.service.ts'
import { sendWebhookMessage } from '#server/services/discord.service.ts'
import { getDistrictLabel } from '#shared/constants/districts.constants.ts'
import { ethnicGroupLabels } from '#shared/constants/ethnicity.ts'

export const DONATION_EMBED_COLOR = 0xd4a017

export async function sendPrivateDonationNotification(
  data: DonationNotificationData
): Promise<void> {
  const webhookUrl = env.DONATE_PRIVATE_NOTIFICATION_WEBHOOK
  if (!webhookUrl) {
    logger.error(
      { data },
      '[Donation] Failed to send private discord notification. DONATE_PRIVATE_NOTIFICATION_WEBHOOK is not configured'
    )
    return
  }

  try {
    await sendWebhookMessage({
      url: webhookUrl,
      payload: {
        embeds: [buildPrivateEmbed(data)],
      },
    })
  } catch (err) {
    logger.error({ err, amount: data.amount }, 'Failed to send private donation notification')
  }
}

export async function sendPublicDonationNotification(
  data: DonationNotificationData
): Promise<void> {
  if (data.anonymous) return

  const webhookUrl = env.DONATE_PUBLIC_NOTIFICATION_WEBHOOK
  if (!webhookUrl) {
    logger.error(
      { data },
      '[Donation] Failed to send public discord notification. DONATE_PUBLIC_NOTIFICATION_WEBHOOK is not configured'
    )
    return
  }

  try {
    await sendWebhookMessage({
      url: webhookUrl,
      payload: {
        username: 'LS Catholics',
        avatar_url: 'https://i.imgur.com/0f4ZQS0.png',
        embeds: [buildPublicEmbed(data)],
      },
    })
  } catch (err) {
    logger.error({ err, amount: data.amount }, 'Failed to send public donation notification')
  }
}

function buildPrivateEmbed(data: DonationNotificationData): DiscordEmbed {
  const fields: DiscordEmbed['fields'] = [
    { name: 'Identité', value: `${data.firstname} ${data.lastname}` },
  ]

  if (data.isOrganization && data.organizationName) {
    fields.push({
      name: "Au nom d'une société / organisation",
      value: data.organizationName,
    })
  }

  if (data.age) {
    fields.push({ name: 'Âge', value: `${data.age} ans` })
  }

  if (data.ethnicity) {
    fields.push({ name: 'Ethnie', value: ethnicGroupLabels[data.ethnicity] })
  }

  if (data.phone) {
    fields.push({ name: 'Téléphone', value: data.phone })
  }

  if (data.address) {
    const district = data.district ? ` (${getDistrictLabel(data.district)})` : ''
    fields.push({ name: 'Adresse', value: `${data.address}${district}` })
  }

  fields.push(
    { name: 'Montant du don', value: formatCurrency(data.amount) },
    {
      name: 'Le don peut-il être rendu public ?',
      value: data.anonymous ? '⛔ NON' : '✅ OUI',
    }
  )

  return {
    title: 'Don réalisé en ligne !',
    color: DONATION_EMBED_COLOR,
    fields,
    timestamp: new Date().toISOString(),
  }
}

function buildPublicEmbed(data: DonationNotificationData): DiscordEmbed {
  return {
    title: "Un nouveau don en soutien à la mission de l'Église !",
    description: buildPublicDescription(data),
    color: resolveEmbedColor(data.amount),
    image: { url: 'https://i.imgur.com/sZX0DD2.jpeg' },
    timestamp: new Date().toISOString(),
  }
}

function buildPublicDescription(data: DonationNotificationData): string {
  const donatorName = data.isOrganization
    ? `l'organisation **${data.organizationName ?? ''}**, et son représentant **${data.firstname} ${data.lastname}**`
    : `**${data.firstname} ${data.lastname}**`
  const age = data.age ? ` (${data.age} ans)` : ''
  const formattedAmount = formatCurrency(data.amount)
  const suffix = data.isOrganization
    ? `Merci pour votre engagement ! Nous prions pour **${data.organizationName}**. N'oubliez pas de prier pour nous et tout le Peuple de Dieu, particulièrement pour les plus vulnérables 💖`
    : "Merci pour votre générosité et que la joie de Dieu vous comble. N'oubliez pas de prier pour nous et tout le Peuple de Dieu, particulièrement pour les plus vulnérables 💖"

  return `🙏 Prions pour ${donatorName}${age} et son don de **${formattedAmount}** !\n\n${suffix}`
}

function resolveEmbedColor(amount: number): number {
  if (amount >= 1_000_000) return 0xfff100
  if (amount >= 100_000) return 0xae00ff
  if (amount >= 50_000) return 0x0011ff
  return 0x057a66
}
