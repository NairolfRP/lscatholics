import type { DonateMetadata, DonationNotificationData } from '#donate/types/donate'
import env from '#start/env'
import { DiscordWebhookService } from '#discord/services/discord_webhook_service'
import { getEthnicLabelById } from '#shared/constants/ethnicity.constants'
import { getDistrictLabelById } from '#shared/constants/districts.constants'

export class DonateService {
  async sendPrivateDonateNotification(metadata: DonationNotificationData) {
    const {
      amount,
      firstname,
      lastname,
      age,
      ethnicity,
      phone,
      address,
      district,
      isOrganization,
      organizationName,
      anonymous,
    } = metadata

    const donatorFullName = `${firstname} ${lastname}`
    const formattedAmount = amount.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    })

    const webhookUrl = env.get('DONATE_PRIVATE_NOTIFICATION_WEBHOOK')

    if (!webhookUrl) return

    const discordWebhook = await DiscordWebhookService.create({ url: webhookUrl })

    const timestamp = new Date().toISOString()

    const fields: Array<{ name: string; value: string }> = [
      {
        name: 'Identité',
        value: donatorFullName,
      },
    ]

    if (isOrganization) {
      fields.push({
        name: "Au nom d'une société/organisation",
        value: organizationName!,
      })
    }

    if (age) {
      fields.push({
        name: 'Âge',
        value: age.toString(),
      })
    }

    if (ethnicity) {
      fields.push({
        name: 'Ethnie',
        value: getEthnicLabelById(ethnicity) || 'VALEUR INVALIDE',
      })
    }

    if (phone) {
      fields.push({
        name: 'Téléphone',
        value: phone,
      })
    }

    if (address) {
      fields.push({
        name: 'Adresse',
        value: address,
      })
    }

    if (district) {
      fields.push({
        name: 'District',
        value: getDistrictLabelById(district) || 'VALEUR INVALIDE',
      })
    }

    fields.push({
      name: 'Montant du don',
      value: formattedAmount,
    })

    fields.push({
      name: 'Le don peut-il être rendu public ?',
      value: anonymous ? '⛔ NON' : '✅ OUI',
    })

    discordWebhook.addEmbed({
      title: 'Don réalisé en ligne !',
      timestamp,
      fields: [...fields],
    })

    return discordWebhook.execute()
  }

  async sendPublicDonateNotification(metadata: Omit<DonateMetadata, 'fleecaConfirmation'>) {
    if (metadata.anonymous) return

    const webhookUrl = env.get('DONATE_PUBLIC_NOTIFICATION_WEBHOOK')

    if (!webhookUrl) return

    const { amount, firstname, lastname, age, isOrganization, organizationName } = metadata

    const donatorFullName = `${firstname} ${lastname}`
    const formattedAmount = amount.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    })

    let embedDescription: string = `\uD83D\uDE4F Prions pour **${donatorFullName}** et son don de **${formattedAmount}** !\n\nMerci pour votre générosité et que la joie de Dieu vous comble. N'oubliez pas de prier pour nous et tout le Peuple de Dieu, particulièrement pour les plus vulnérables \uD83D\uDC96`
    let embedColor: number

    if (age && isOrganization) {
      embedDescription = `\uD83D\uDE4F Merci à l'organisation **${organizationName}**, et son représentant **${donatorFullName}** (${age} ans), pour son don de **${formattedAmount}** !\n\nMerci pour votre engagement ! N'oubliez pas de prier pour nous et tout le Peuple de Dieu, particulièrement pour les plus vulnérables \uD83D\uDC96`
    } else if (isOrganization) {
      embedDescription = `\uD83D\uDE4F Merci à l'organisation **${organizationName}**, et son représentant **${donatorFullName}**, pour son don de **${formattedAmount}** !\n\nMerci pour votre engagement ! N'oubliez pas de prier pour nous et tout le Peuple de Dieu, particulièrement pour les plus vulnérables \uD83D\uDC96`
    } else if (age) {
      embedDescription = `\uD83D\uDE4F Prions pour **${donatorFullName}**, ${age} ans, et son don de **${formattedAmount}** !\n\nMerci pour votre générosité et que la joie de Dieu vous comble. N'oubliez pas de prier pour nous et tout le Peuple de Dieu, particulièrement pour les plus vulnérables \uD83D\uDC96`
    }

    switch (true) {
      case amount >= 1000000:
        embedColor = 16774912
        break
      case amount >= 100000:
        embedColor = 11403519
        break
      case amount >= 50000:
        embedColor = 4607
        break
      default:
        embedColor = 358886
        break
    }

    const discordWebhook = await DiscordWebhookService.create({ url: webhookUrl })

    const timestamp = new Date().toISOString()
    discordWebhook.addEmbed({
      title: "Un nouveau don en soutien à la mission de l'Église !",
      description: embedDescription,
      color: embedColor,
      image: { url: 'https://i.imgur.com/sZX0DD2.jpeg' },
      timestamp,
    })

    discordWebhook.setOptions({
      username: 'LS Catholics',
      avatarUrl: 'https://i.imgur.com/0f4ZQS0.png',
    })

    return discordWebhook.execute()
  }
}
