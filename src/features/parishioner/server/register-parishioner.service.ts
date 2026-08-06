import { setResponseStatus } from '@tanstack/react-start/server'
import { z } from 'zod'
import { env } from '#/config/env.server.ts'
import { parishes } from '#/config/parishes.ts'
import { getDistrictLabel } from '#shared/constants/districts.constants.ts'
import {
  civilTitleLabels,
  ethnicCommunityLabels,
  genderLabels,
  getIndividualSacramentLabel,
  householdRoleLabels,
  maritalStatusLabels,
  religionLabels,
} from '#/features/parishioner/constants/person.constants.ts'
import type { ParishionerFormOutput } from '#/features/parishioner/schemas/parishioner.schema.ts'
import {
  PARISHIONER_PARISH_UNSURE_VALUE,
  parishionerSchema,
} from '#/features/parishioner/schemas/parishioner.schema.ts'
import { getFieldErrors } from '#/utils/form.ts'
import { logger } from '#server/integrations/logger.ts'
import type { DiscordEmbed } from '#server/services/discord.service.ts'
import { sendWebhookMessage } from '#server/services/discord.service.ts'
import type { User } from '#shared/lib/types/auth.ts'

export const PARISHIONER_EMBED_COLOR = 0x7c3aed

export const PARISHIONER_ETHNIC_DISCORD_TAGS = Object.freeze({
  latino: '1254695730044604478',
  black: '1254695883665051720',
  irish: '1254696047695892500',
  italian: '1254696098262552606',
  french: '1254696138586718289',
})

export async function submit({ data, user }: { data: unknown; user: User }) {
  const webhookUrl = env.PARISHIONER_REGISTRATION_DISCORD_WEBHOOK

  try {
    if (!webhookUrl) {
      logger.error('Missing PARISHIONER_REGISTRATION_DISCORD_WEBHOOK environment variable')
      setResponseStatus(500)
      return {
        success: false,
        error:
          "L'enregistrement des paroissiens est temporairement désactivé. Réessayez plus tard.",
      }
    }

    const validatedData = await parishionerSchema.parseAsync(data)

    const threadTitle = `Foyer de ${validatedData.firstname} ${validatedData.lastname}`.trim()

    const firstMessage = await sendWebhookMessage({
      url: webhookUrl,
      wait: true,
      payload: {
        embeds: buildMainEmbeds(validatedData),
        thread_name: threadTitle,
        applied_tags: buildEthnicTags(validatedData.ethnicCommunity),
      },
    })

    const threadId = firstMessage?.channel_id
    if (!threadId) {
      throw new Error('Failed to retrieve the Discord thread ID')
    }

    const oocEmbed = buildOocEmbed(validatedData)
    if (oocEmbed) {
      await sendWebhookMessage({
        url: webhookUrl,
        threadId,
        payload: {
          embeds: [oocEmbed],
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

    logger.error({ err, data, userId: user.id }, 'Failed to register a parishioner')
    setResponseStatus(500)
    return { success: false, error: 'Une erreur est survenue' }
  }
}

function buildEthnicTags(ethnicCommunity: string | undefined): string[] | undefined {
  if (!ethnicCommunity) return undefined
  const tag =
    PARISHIONER_ETHNIC_DISCORD_TAGS[ethnicCommunity as keyof typeof PARISHIONER_ETHNIC_DISCORD_TAGS]
  return tag ? [tag] : undefined
}

function buildMainEmbeds(data: ParishionerFormOutput): DiscordEmbed[] {
  const embeds: DiscordEmbed[] = [buildIdentityEmbed(data)]

  if (data.message?.trim()) {
    embeds.push({
      title: 'Informations complémentaires',
      description: data.message,
    })
  }

  if (data.familyMembers.length > 0) {
    embeds.push({
      title: `Membres du foyer (${data.familyMembers.length})`,
      description: formatFamilyMembers(data.familyMembers),
    })
  }

  return embeds
}

function buildIdentityEmbed(data: ParishionerFormOutput): DiscordEmbed {
  const parish = parishes.find((p) => p.id === data.parish)
  const districtLabel = getDistrictLabel(data.district)

  return {
    title: `Nouvelle inscription — Foyer de ${data.firstname} ${data.lastname}`,
    thumbnail: { url: 'https://i.imgur.com/zkPlrIe.png' },
    color: PARISHIONER_EMBED_COLOR,
    fields: [
      {
        name: 'Titre de civilité',
        value: data.civilTitle ? civilTitleLabels[data.civilTitle] : 'N/A',
        inline: true,
      },
      {
        name: 'État matrimonial',
        value: data.maritalStatus ? maritalStatusLabels[data.maritalStatus] : 'N/A',
        inline: true,
      },
      { name: 'Identité', value: `${data.firstname} ${data.lastname}`, inline: true },
      { name: 'Sexe', value: genderLabels[data.gender], inline: true },
      { name: 'Âge', value: `${data.age} ans`, inline: true },
      {
        name: 'Communauté ethnique',
        value: data.ethnicCommunity ? ethnicCommunityLabels[data.ethnicCommunity] : 'N/A',
        inline: true,
      },
      { name: 'Activité / emploi', value: data.occupation || 'N/A', inline: true },
      { name: 'Numéro de téléphone', value: data.phone, inline: true },
      {
        name: "N° à appeler en cas d'urgence",
        value: data.emergencyPhone || 'N/A',
        inline: true,
      },
      { name: 'Adresse', value: `${data.address}${districtLabel ? ` (${districtLabel})` : ''}` },
      { name: 'Baptisé', value: formatBaptized(data.baptized), inline: true },
      {
        name: 'Religion',
        value: data.religion ? religionLabels[data.religion] : 'N/A',
        inline: true,
      },
      {
        name: 'Paroisse',
        value:
          data.parish === PARISHIONER_PARISH_UNSURE_VALUE
            ? 'Je ne suis pas sûr'
            : (parish?.title ?? 'N/A'),
      },
      {
        name: 'Contactable pour du bénévolat',
        value: data.isVolunteer ? '✅ Oui' : '❌ Non',
      },
    ],
    footer: {
      text: 'LS Catholics - Enregistrement des paroissiens',
      icon_url: 'https://i.imgur.com/zkPlrIe.png',
    },
    timestamp: new Date().toISOString(),
  }
}

function buildOocEmbed(data: ParishionerFormOutput): DiscordEmbed | null {
  const oocContent = formatOOCInfo(data.characterSacraments, data.oocAdditionalInformation)
  if (!oocContent) return null

  return {
    title: '(( Partie OOC ))',
    description: oocContent,
  }
}

function formatBaptized(baptized: ParishionerFormOutput['baptized']) {
  if (baptized === 'yes') return '✅ Oui'
  if (baptized === 'no') return '❌ Non'
  return 'Pas sûr'
}

function formatFamilyMembers(members: ParishionerFormOutput['familyMembers']) {
  return members
    .map((member) => {
      const npcTag = member.isNpc ? ' (( PNJ ))' : ''
      return `* ${member.firstname} ${member.lastname} (${member.age} ans - ${householdRoleLabels[member.role]})${npcTag}`
    })
    .join('\n')
}

function formatOOCInfo(sacraments: string[], additionalInfo?: string): string | null {
  if (!sacraments.length && !additionalInfo) return null

  let content = ''

  if (sacraments.length) {
    const labels = sacraments.map(getIndividualSacramentLabel).filter(Boolean).join(', ')
    if (labels) {
      content += `**Votre personnage a reçu les sacrements de...** :\n${labels}\n\n`
    }
  }

  if (additionalInfo) {
    content += `**Qu'est-ce que le clergé de l'archidiocèse de Los Santos est censé savoir en RP sur votre personnage ?**\n>>> ${additionalInfo}`
  }

  return content
}
