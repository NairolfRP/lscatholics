import { setResponseStatus } from '@tanstack/react-start/server'
import { z } from 'zod'
import { env } from '#/config/env.server.ts'
import { contactSubjectLabels } from '#/features/contact/constants/contact-subjects.ts'
import { contactSchema } from '#/features/contact/schemas/contact.schema.ts'
import { getFieldErrors } from '#/utils/form.ts'
import { logger } from '#server/integrations/logger.ts'
import type { DiscordEmbed } from '#server/services/discord.service.ts'
import { sendWebhookMessage } from '#server/services/discord.service.ts'
import type { User } from '#shared/lib/types/auth.ts'

export const CONTACT_EMBED_COLOR = 0x7c3aed

export async function submit({
  data,
  user,
  currentCharacter,
}: {
  data: unknown
  user: User
  currentCharacter: { firstname?: string; lastname?: string } | null
}) {
  const webhookUrl = env.CONTACT_DISCORD_WEBHOOK

  try {
    if (!webhookUrl) {
      logger.error('Missing CONTACT_DISCORD_WEBHOOK environment variable')
      setResponseStatus(500)
      return {
        success: false,
        error: 'Le formulaire de contact est temporairement désactivé. Réessayez plus tard.',
      }
    }

    const validatedData = await contactSchema.parseAsync(data)

    await sendWebhookMessage({
      url: webhookUrl,
      payload: {
        embeds: buildContactEmbeds({ data: validatedData }),
        thread_name: `${validatedData.firstName} ${validatedData.lastName}`.trim(),
        applied_tags: ['1300492266359754813'],
      },
    })

    return { success: true }
  } catch (err) {
    if (err instanceof z.ZodError) {
      const validationErrors = getFieldErrors(err)
      setResponseStatus(400)
      return { success: false, validationErrors }
    }

    logger.error({ err, data, userId: user.id }, 'Failed to submit the contact form')
    setResponseStatus(500)
    return { success: false, error: 'Une erreur est survenue' }
  }
}

function buildContactEmbeds({
  data,
}: {
  data: z.infer<typeof contactSchema>
  currentCharacter: { firstname?: string; lastname?: string } | null
}): DiscordEmbed[] {
  return [
    {
      title: `Nouvelle demande de contact — ${contactSubjectLabels[data.subject]}`,
      thumbnail: { url: 'https://i.imgur.com/zkPlrIe.png' },
      color: CONTACT_EMBED_COLOR,
      fields: [
        { name: 'Prénom', value: data.firstName, inline: true },
        { name: 'Nom', value: data.lastName, inline: true },
        { name: 'Téléphone', value: String(data.phone) },
        { name: 'Sujet', value: contactSubjectLabels[data.subject] },
      ],
      footer: {
        text: 'LS Catholics - Formulaire de contact en ligne',
        icon_url: 'https://i.imgur.com/zkPlrIe.png',
      },
      timestamp: new Date().toISOString(),
    },
    {
      title: 'Message',
      description: data.message,
    },
  ]
}
