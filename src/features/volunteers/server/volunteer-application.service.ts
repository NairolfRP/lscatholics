import { setResponseStatus } from '@tanstack/react-start/server'
import { z } from 'zod'
import { env } from '#/config/env.server.ts'
import {
  applicationSourceLabels,
  requiredHoursReasonLabels,
  spokenLanguageLabels,
} from '#/features/volunteers/constants/volunteer.constants.ts'
import {
  volunteerApplicationSchema,
} from '#/features/volunteers/schemas/volunteer-application.schema.ts'
import { getFieldErrors } from '#/utils/form.ts'
import { logger } from '#server/integrations/logger.ts'
import type { DiscordEmbed } from '#server/services/discord.service.ts'
import { sendWebhookMessage } from '#server/services/discord.service.ts'
import { getDistrictLabel } from '#shared/constants/districts.constants.ts'
import { ethnicGroupLabels } from '#shared/constants/ethnicity.ts'
import type { User } from '#shared/lib/types/auth.ts'

export const VOLUNTEER_APPLICATION_EMBED_COLOR = 0xd4a017

export async function submit({ data, user }: { data: unknown; user: User }) {
  const webhookUrl = env.VOLUNTEER_APPLICATION_DISCORD_WEBHOOK

  try {
    if (!webhookUrl) {
      logger.error('Missing VOLUNTEER_APPLICATION_DISCORD_WEBHOOK environment variable')
      setResponseStatus(500)
      return {
        success: false,
        error:
          'Les candidatures de bénévolat sont temporairement désactivées. Réessayez plus tard.',
      }
    }

    const validatedData = await volunteerApplicationSchema.parseAsync(data)

    const threadName = `[Bénévolat] ${buildFullName(validatedData)}`

    const firstMessage = await sendWebhookMessage({
      url: webhookUrl,
      wait: true,
      payload: {
        embeds: buildMainEmbeds(validatedData),
        thread_name: threadName,
      },
    })

    const threadId = firstMessage?.channel_id
    if (!threadId) {
      throw new Error('Failed to retrieve the Discord thread ID')
    }

    const followUpEmbeds = buildFollowUpEmbeds(validatedData)
    if (followUpEmbeds.length > 0) {
      await sendWebhookMessage({
        url: webhookUrl,
        threadId,
        payload: {
          embeds: followUpEmbeds,
        },
      })
    }

    return { success: true }
  } catch (err) {
    if (err instanceof z.ZodError) {
      const validationErrors = getFieldErrors(err)
      setResponseStatus(400)
      return { success: false, validationErrors }
    }

    logger.error({ err, data, userId: user.id }, 'Failed to submit a volunteer application')
    setResponseStatus(500)
    return { success: false, error: 'Une erreur est survenue' }
  }
}

function buildMainEmbeds(data: z.output<typeof volunteerApplicationSchema>): DiscordEmbed[] {
  const embeds: DiscordEmbed[] = [buildMainInfoEmbed(data)]

  const requiredHoursEmbed = buildRequiredHoursEmbed(data)
  if (requiredHoursEmbed) {
    embeds.push(requiredHoursEmbed)
  }

  return embeds
}

function buildFollowUpEmbeds(data: z.output<typeof volunteerApplicationSchema>): DiscordEmbed[] {
  const fields: { name: string; value: string }[] = []

  if (data.otherLanguages.length > 0) {
    fields.push({
      name: 'Autres langues maîtrisées',
      value: data.otherLanguages
        .map((language) => `* ${spokenLanguageLabels[language]}`)
        .join('\n'),
    })
  }

  if (data.interestedActivities) {
    fields.push({
      name: "Quels types de tâches ou d'activités vous intéresseraient ?",
      value: data.interestedActivities,
    })
  }

  if (data.volunteerAvailability) {
    fields.push({
      name: 'Disponibilités hebdomadaires pour le bénévolat',
      value: data.volunteerAvailability,
    })
  }

  if (fields.length === 0) return []

  return [
    {
      title: 'Engagement & disponibilités',
      description: fields.map((field) => `**${field.name}**\n${field.value}`).join('\n\n'),
    },
  ]
}

function buildMainInfoEmbed(data: z.output<typeof volunteerApplicationSchema>): DiscordEmbed {
  const fields: DiscordEmbed['fields'] = [
    { name: 'Identité', value: buildFullName(data), inline: true },
    { name: 'Âge', value: `${data.age} ans`, inline: true },
    {
      name: 'Adresse',
      value: `${data.address}${getDistrictLabel(data.district) ? ` (${getDistrictLabel(data.district)})` : ''}`,
    },
    { name: 'Numéro de téléphone', value: data.phone, inline: true },
  ]

  if (data.emergencyPhone) {
    fields.push({
      name: "N° à appeler en cas d'urgence",
      value: data.emergencyPhone,
      inline: true,
    })
  }

  if (data.ethnicity) {
    fields.push({
      name: 'Ethnie',
      value: ethnicGroupLabels[data.ethnicity],
      inline: true,
    })
  }

  if (data.applicantSource.type) {
    fields.push({
      name: 'Comment avez-vous entendu parler de ce bénévolat ?',
      value: applicationSourceLabels[data.applicantSource.type],
      inline: true,
    })

    if (data.applicantSource.type === 'employeeReferral' && data.applicantSource.employeeReferral) {
      fields.push({
        name: 'Employé référent',
        value: data.applicantSource.employeeReferral,
        inline: true,
      })
    }
  }

  return {
    title: `Candidature bénévole — ${buildFullName(data)}`,
    thumbnail: { url: 'https://i.imgur.com/zkPlrIe.png' },
    color: VOLUNTEER_APPLICATION_EMBED_COLOR,
    fields,
    footer: {
      text: 'LS Catholics - Candidature au bénévolat',
      icon_url: 'https://i.imgur.com/zkPlrIe.png',
    },
    timestamp: new Date().toISOString(),
  }
}

function buildRequiredHoursEmbed(
  data: z.output<typeof volunteerApplicationSchema>
): DiscordEmbed | null {
  if (!data.requiredHours.reason) return null

  const description = [
    {
      name: 'Motif',
      value: requiredHoursReasonLabels[data.requiredHours.reason],
    },
    {
      name: 'Date limite pour valider les heures',
      value: data.requiredHours.deadline ?? 'Inconnue',
    },
  ]
    .map((field) => `**${field.name}** : ${field.value}`)
    .join('\n')

  return {
    title:
      'CANDIDATURE DANS LE CADRE D’UNE OBLIGATION DE RÉALISER UN SERVICE COMMUNAUTAIRE OU UN BÉNÉVOLAT',
    description,
  }
}

function buildFullName(data: { firstname: string; middleName?: string; lastname: string }): string {
  const middleInitial = data.middleName ? ` ${data.middleName.charAt(0).toUpperCase()}.` : ''
  return `${data.firstname}${middleInitial} ${data.lastname}`
}
