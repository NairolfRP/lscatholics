import type { APIComponentInContainer, APIMessageTopLevelComponent } from 'discord-api-types/v10'
import { ComponentType, MessageFlags, SeparatorSpacingSize } from 'discord-api-types/v10'
import { formatDate } from '#/utils/date.ts'
import { truncate } from '#/utils/string.ts'
import { escapeDiscordMarkdown, sendWebhookMessage } from '#server/services/discord.service.ts'

export const INCIDENT_REPORT_ACCENT_COLOR = 0xdc2626

// Discord counts every character rendered by the components of a message.
// Keep a margin so the header, separators and text display always fit.
const MESSAGE_TEXT_LIMIT = 4000
const TEXT_SAFETY_MARGIN = 16
const FIRST_HEADER = '## 🚨 Rapport d’incident'
const CONTINUATION_HEADER = '## 🚨 Rapport d’incident (suite)'
const MAX_THREAD_NAME_LENGTH = 100

export type IncidentReportNotificationData = {
  identity: string
  position: string
  incidentAt: Date
  location: string
  nature: string
  witnesses?: string
  details: string
}

export type IncidentReportMessage = {
  components: APIMessageTopLevelComponent[]
}

export function buildIncidentReportMessages(
  data: IncidentReportNotificationData
): IncidentReportMessage[] {
  const chunks = splitText(
    buildIncidentReportBody(data),
    MESSAGE_TEXT_LIMIT - TEXT_SAFETY_MARGIN - CONTINUATION_HEADER.length
  )

  return chunks.map((chunk, index) => ({
    components: [buildContainer(index === 0 ? FIRST_HEADER : CONTINUATION_HEADER, chunk)],
  }))
}

export function buildIncidentReportThreadName(data: IncidentReportNotificationData): string {
  const date = formatDate(data.incidentAt, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
  const prefix = `(${date}) `
  const maxNatureLength = MAX_THREAD_NAME_LENGTH - prefix.length
  const nature = data.nature.replace(/\s+/g, ' ').trim()

  return `${prefix}${truncate(nature, maxNatureLength)}`
}

export async function sendIncidentReportNotification({
  webhookUrl,
  data,
}: {
  webhookUrl: string
  data: IncidentReportNotificationData
}): Promise<void> {
  const [firstMessage, ...followUpMessages] = buildIncidentReportMessages(data)

  const createdMessage = await sendWebhookMessage({
    url: webhookUrl,
    payload: {
      flags: MessageFlags.IsComponentsV2,
      components: firstMessage.components,
      thread_name: buildIncidentReportThreadName(data),
      allowed_mentions: { parse: [] },
    },
    wait: true,
    withComponents: true,
  })

  if (!createdMessage) {
    throw new Error('Discord did not return the created incident report thread')
  }

  for (const message of followUpMessages) {
    await sendWebhookMessage({
      url: webhookUrl,
      payload: {
        flags: MessageFlags.IsComponentsV2,
        components: message.components,
        allowed_mentions: { parse: [] },
      },
      threadId: createdMessage.channel_id,
      withComponents: true,
    })
  }
}

function buildIncidentReportBody(data: IncidentReportNotificationData): string {
  const incidentTimestamp = Math.floor(data.incidentAt.getTime() / 1000)

  return [
    `**Identité**\n${escapeDiscordMarkdown(data.identity)}`,
    `**Poste**\n${escapeDiscordMarkdown(data.position)}`,
    `**Date et heure de l’incident**\n<t:${incidentTimestamp}:F>`,
    `**Lieu de l’incident**\n${escapeDiscordMarkdown(data.location)}`,
    `**Nature de l’incident**\n${escapeDiscordMarkdown(data.nature)}`,
    `**Témoins**\n${data.witnesses ? escapeDiscordMarkdown(data.witnesses) : 'Aucun témoin renseigné'}`,
    `**Détail de l’incident**\n${data.details}`,
  ].join('\n\n')
}

function buildContainer(header: string, body: string): APIMessageTopLevelComponent {
  return {
    type: ComponentType.Container,
    accent_color: INCIDENT_REPORT_ACCENT_COLOR,
    components: [
      {
        type: ComponentType.TextDisplay,
        content: header,
      },
      {
        type: ComponentType.Separator,
        spacing: SeparatorSpacingSize.Small,
      },
      {
        type: ComponentType.TextDisplay,
        content: body,
      },
    ] satisfies APIComponentInContainer[],
  }
}

function splitText(text: string, maxLength: number): string[] {
  if (text.length <= maxLength) {
    return [text]
  }

  const chunks: string[] = []
  let remaining = text

  while (remaining.length > maxLength) {
    const remainingChunks = Math.ceil(remaining.length / maxLength)
    const minSplit = remaining.length - (remainingChunks - 1) * maxLength
    let splitIndex = 0

    for (const separator of ['\n\n', '\n', ' ']) {
      const candidate = remaining.lastIndexOf(separator, maxLength)

      if (candidate >= minSplit && candidate > 0) {
        splitIndex = candidate
        break
      }
    }

    if (splitIndex === 0) {
      splitIndex = maxLength
    }

    chunks.push(remaining.slice(0, splitIndex).trimEnd())
    remaining = remaining.slice(splitIndex).trimStart()
  }

  if (remaining) {
    chunks.push(remaining)
  }

  return chunks
}
