import env from '#start/env'
import type { VolunteerApplicationPayload } from '#volunteers/validators/volunteer_application'
import { DiscordWebhookService } from '#discord/services/discord_webhook_service'
import { getDistrictLabelById } from '#shared/constants/districts.constants'
import { getApplicationSourceLabel } from '#shared/constants/employment.constants'
import type {
  DiscordEmbed,
  DiscordEmbedField,
} from '#discord/types/interfaces/entities/discord_embed'
import { getEthnicLabelById } from '#shared/constants/ethnicity.constants'
import { getSpokenLanguagesLabelById } from '#shared/constants/person.constants'
import { getVolunteerApplicationRequiredHoursLabelById } from '#shared/constants/volunteers.constants'

export class VolunteerApplicationService {
  async sendToDiscord(payload: VolunteerApplicationPayload) {
    const webhookUrl = env.get('DISCORD_VOLUNTEER_APPLICATION_WEBHOOK')

    if (!webhookUrl) {
      throw new Error(
        "[VOLUNTEER APPLICATION] The environment variable 'DISCORD_VOLUNTEER_APPLICATION_WEBHOOK' is missing"
      )
    }

    const characterFullName = `${payload.firstname}${payload.middleName ? ' ' + payload.middleName.charAt(0).toUpperCase() + '. ' : ' '}${payload.lastname}`
    const discordWebhook = await DiscordWebhookService.create({ url: webhookUrl, retries: 5 })

    discordWebhook.setOptions({
      waitServerConfirmation: true,
      thread: {
        name: `[Bénévolat] ${characterFullName}`,
      },
    })

    discordWebhook.addEmbeds([this.#buildMainInfoEmbed(characterFullName, payload)])

    const result = await discordWebhook.execute()
    if (!result.success) {
      throw new Error(`[VOLUNTEER APPLICATION] Discord Webhook failed: ${result.error}`)
    }

    const threadId = result.data?.channel_id
    if (!threadId) {
      throw new Error('[VOLUNTEER APPLICATION] Failed to retrieve Discord thread ID')
    }

    const secondDiscordMessageEmbeds = [
      this.#buildInterestsAndSkillsEmbed(characterFullName, payload),
      this.#buildRequiredHoursEmbed(payload),
    ].filter((embed) => embed !== undefined)

    if (secondDiscordMessageEmbeds.length === 0) return

    discordWebhook.clear()
    discordWebhook.setOptions({ thread: { id: threadId } })
    discordWebhook.addEmbeds(secondDiscordMessageEmbeds)

    const secondDiscordMessageResult = await discordWebhook.execute()
    if (!secondDiscordMessageResult.success) {
      throw new Error(
        `[VOLUNTEER APPLICATION] Second Message Discord Webhook failed: ${result.error}`
      )
    }
  }

  #buildMainInfoEmbed(fullName: string, payload: VolunteerApplicationPayload): DiscordEmbed {
    const districtLabel = getDistrictLabelById(payload.district)
    const sourceLabel = payload.applicantSource.type
      ? getApplicationSourceLabel(payload.applicantSource.type)
      : undefined

    const fields: DiscordEmbedField[] = [{ name: 'Prénom', value: payload.firstname, inline: true }]

    if (payload.middleName) {
      fields.push({ name: 'Deuxième prénom', value: payload.middleName, inline: true })
    }

    fields.push(
      { name: 'Nom de famille', value: payload.lastname, inline: true },
      { name: 'Âge', value: `${payload.age}`, inline: true },
      { name: 'Adresse', value: `${payload.address} (${districtLabel})` },
      { name: 'Numéro de téléphone', value: `${payload.phone}`, inline: true }
    )

    if (payload.emergencyPhone && payload.emergencyPhone.trim() !== '') {
      fields.push({
        name: "N° à appeler en cas d'urgence",
        value: `${payload.emergencyPhone || 'N/A'}`,
        inline: true,
      })
    }

    if (payload.ethnicity) {
      fields.push({
        name: 'Ethnie',
        value: getEthnicLabelById(payload.ethnicity) ?? 'N/A',
      })
    }

    if (sourceLabel) {
      fields.push({
        name: 'Comment avez-vous entendu parler de ce bénévolat ?',
        value: sourceLabel,
      })

      if (
        payload.applicantSource.type === 'employeeReferral' &&
        payload.applicantSource.employeeReferral
      ) {
        fields.push({
          name: 'Employé référent',
          value: payload.applicantSource.employeeReferral,
        })
      }
    }

    return {
      author: {
        name: 'LS Catholics',
        icon_url: 'https://i.imgur.com/0f4ZQS0.png',
      },
      title: `[Bénévolat] ${fullName}`,
      fields,
      color: 0x2b2d31,
    }
  }

  #buildInterestsAndSkillsEmbed(
    fullName: string,
    payload: VolunteerApplicationPayload
  ): DiscordEmbed | undefined {
    const fields: Array<{ name: string; value: string }> = []

    if (payload.otherLanguages && payload.otherLanguages.length > 0) {
      fields.push({
        name: 'Langues maitrisées',
        value: payload.otherLanguages
          .map((l: string) => `* ${getSpokenLanguagesLabelById(l)}`)
          .join('\n'),
      })
    }

    if (payload.interestedActivities && payload.interestedActivities.trim() !== '') {
      fields.push({
        name: "Quelles types de tâches ou d'activités vous intéresseraient ?",
        value: payload.interestedActivities,
      })
    }

    if (payload.volunteerAvailability && payload.volunteerAvailability.trim() !== '') {
      fields.push({
        name: 'Disponibilités hebdomadaires pour le bénévolat',
        value: payload.volunteerAvailability,
      })
    }

    if (fields.length === 0) return

    const description = fields.map((field) => `**${field.name}**\n${field.value}`).join('\n\n')

    return {
      author: {
        name: 'LS Catholics',
        icon_url: 'https://i.imgur.com/0f4ZQS0.png',
      },
      title: `[Bénévolat] ${fullName}`,
      description,
      color: 0x2b2d31,
    }
  }

  #buildRequiredHoursEmbed(payload: VolunteerApplicationPayload): DiscordEmbed | undefined {
    if (!payload.requiredHours || !payload.requiredHours?.reason) return

    const description = [
      {
        name: 'Motif',
        value:
          getVolunteerApplicationRequiredHoursLabelById(payload.requiredHours.reason) ?? 'Inconnue',
      },
      {
        name: 'Date limite pour valider les heures',
        value: payload.requiredHours.deadline ?? 'Inconnues',
      },
    ]
      .map((field) => `**${field.name}** : ${field.value}`)
      .join('\n')

    return {
      title:
        "CANDIDATURE DANS LE CADRE D'UNE OBLIGATION DE RÉALISER UN SERVICE COMMUNAUTAIRE OU UN BÉNÉVOLAT",
      description,
    }
  }
}
