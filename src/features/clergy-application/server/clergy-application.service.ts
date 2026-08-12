import { setResponseStatus } from '@tanstack/react-start/server'
import { z } from 'zod'
import { env } from '#/config/env.server.ts'
import type {
  ClergyRole,
} from '#/features/clergy-application/constants/clergy-application.constants.ts'
import {
  CLERGY_APPLICATION_DISCORD_PENDING_THREAD_TAG,
  clergyApplicationDiscordThreadTag,
  clergyMaritalStatusLabels,
  clergyRoleLabels,
} from '#/features/clergy-application/constants/clergy-application.constants.ts'
import type {
  ClergyApplicationOutput,
} from '#/features/clergy-application/schemas/clergy-application.schema.ts'
import {
  clergyApplicationSchema,
} from '#/features/clergy-application/schemas/clergy-application.schema.ts'
import { getFieldErrors } from '#/utils/form.ts'
import { truncate } from '#/utils/string.ts'
import { logger } from '#server/integrations/logger.ts'
import type { DiscordEmbed } from '#server/services/discord.service.ts'
import { sendWebhookMessage } from '#server/services/discord.service.ts'
import type { User } from '#shared/lib/types/auth.ts'

export const CLERGY_APPLICATION_EMBED_COLOR = 0xd4a017

export async function submit({
  data,
  user,
}: {
  data: { role: ClergyRole; values: unknown }
  user: User
}) {
  const webhookUrl = env.CLERGY_APPLICATION_DISCORD_WEBHOOK

  try {
    if (!webhookUrl) {
      logger.error('Missing CLERGY_APPLICATION_DISCORD_WEBHOOK environment variable')
      setResponseStatus(500)
      return {
        success: false,
        error:
          '(( Les candidatures au clergé sont temporairement désactivées. Réessayez plus tard. ))',
      }
    }

    const validatedData = await clergyApplicationSchema(data.role).parseAsync(data.values)

    const characterName = `${validatedData.firstname} ${validatedData.lastname}`
    const threadName = truncate(`[Clergé] ${characterName}`, 100)

    const firstMessage = await sendWebhookMessage({
      url: webhookUrl,
      wait: true,
      payload: {
        thread_name: threadName,
        applied_tags: [
          CLERGY_APPLICATION_DISCORD_PENDING_THREAD_TAG,
          clergyApplicationDiscordThreadTag[data.role],
        ],
        embeds: buildMainEmbeds(data.role, validatedData, characterName, user.name),
      },
    })

    const threadId = firstMessage?.channel_id
    if (!threadId) {
      throw new Error('Failed to retrieve the Discord thread ID')
    }

    await sendWebhookMessage({
      url: webhookUrl,
      threadId,
      payload: {
        embeds: [buildStoryEmbed(validatedData), buildMotivationsEmbed(validatedData)],
      },
    })

    await sendWebhookMessage({
      url: webhookUrl,
      threadId,
      payload: {
        poll: {
          question: {
            text: 'Approuvez-vous cette candidature ?',
          },
          answers: [
            {
              poll_media: {
                text: 'Placet',
                emoji: {
                  id: null,
                  name: '☑️',
                },
              },
            },
            {
              poll_media: {
                text: 'Non placet',
                emoji: {
                  id: null,
                  name: '❌',
                },
              },
            },
          ],
          duration: 32,
        },
      },
    })

    return { success: true }
  } catch (err) {
    if (err instanceof z.ZodError) {
      const validationErrors = getFieldErrors(err)
      setResponseStatus(400)
      return { success: false, validationErrors }
    }

    logger.error({ err, userId: user.id }, 'Failed to submit a clergy application')
    setResponseStatus(500)
    return { success: false, error: 'Une erreur est survenue' }
  }
}

function buildMainEmbeds(
  role: ClergyRole,
  data: ClergyApplicationOutput,
  characterName: string,
  ucpUsername: string
): DiscordEmbed[] {
  const fields: DiscordEmbed['fields'] = [
    { name: 'Pseudo UCP', value: ucpUsername, inline: true },
    { name: 'Pseudo Discord', value: data.discordUsername, inline: true },
  ]

  if (data.sanctions) {
    fields.push({ name: 'Dossier GTA World', value: data.sanctions })
  }

  if (data.maritalStatus) {
    fields.push({
      name: 'Situation matrimoniale',
      value: clergyMaritalStatusLabels[data.maritalStatus],
      inline: true,
    })
  }

  fields.push(
    { name: 'Nom du personnage', value: characterName, inline: true },
    { name: 'Âge du personnage', value: `${data.age} ans`, inline: true },
    { name: 'Rôle souhaité', value: clergyRoleLabels[role], inline: true }
  )

  return [
    {
      title: `Candidature au clergé — ${characterName}`,
      thumbnail: { url: 'https://i.imgur.com/zkPlrIe.png' },
      color: CLERGY_APPLICATION_EMBED_COLOR,
      fields,
      footer: {
        text: 'LS Catholics - Candidature au clergé',
        icon_url: 'https://i.imgur.com/zkPlrIe.png',
      },
      timestamp: new Date().toISOString(),
    },
  ]
}

function buildStoryEmbed(data: ClergyApplicationOutput): DiscordEmbed {
  return {
    title: 'Histoire de votre personnage',
    description: data.characterStory,
  }
}

function buildMotivationsEmbed(data: ClergyApplicationOutput): DiscordEmbed {
  return {
    title: 'Pourquoi voulez-vous rejoindre la faction ?',
    description: data.motivations,
  }
}
