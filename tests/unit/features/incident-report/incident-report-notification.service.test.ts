import { ComponentType, MessageFlags } from 'discord-api-types/v10'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type {
  IncidentReportMessage,
  IncidentReportNotificationData,
} from '#/features/incident-report/server/incident-report-notification.service.ts'
import {
  buildIncidentReportMessages,
  buildIncidentReportThreadName,
  sendIncidentReportNotification,
} from '#/features/incident-report/server/incident-report-notification.service.ts'

const sendWebhookMessageMock = vi.hoisted(() => vi.fn())

vi.mock('#server/services/discord.service.ts', async (importOriginal) => {
  const actual = await importOriginal<typeof import('#server/services/discord.service.ts')>()
  return { ...actual, sendWebhookMessage: sendWebhookMessageMock }
})

const incidentReport: IncidentReportNotificationData = {
  identity: 'Jean Valjean',
  position: 'Superviseur',
  incidentAt: new Date('2026-08-05T14:09:05.100Z'),
  location: 'Mission Row',
  nature: 'Vol à main armée',
  witnesses: 'Cosette',
  details: 'Un individu masqué a dérobé la caisse avant de prendre la fuite vers le sud.',
}

function getMessageText(message: IncidentReportMessage): string {
  return message.components
    .flatMap((component) => {
      if (component.type !== ComponentType.Container) return []

      return component.components.flatMap((child) =>
        child.type === ComponentType.TextDisplay ? [child.content] : []
      )
    })
    .join('\n')
}

describe('buildIncidentReportMessages', () => {
  it('builds a single components v2 message for a short report', () => {
    const messages = buildIncidentReportMessages(incidentReport)

    expect(messages).toHaveLength(1)

    const text = getMessageText(messages[0])
    expect(text).toContain('Rapport d’incident')
    expect(text).toContain('**Identité**\nJean Valjean')
    expect(text).toContain('**Poste**\nSuperviseur')
    expect(text).toContain('**Date et heure de l’incident**\n<t:1785938945:F>')
    expect(text).toContain('**Lieu de l’incident**\nMission Row')
    expect(text).toContain('**Nature de l’incident**\nVol à main armée')
    expect(text).toContain('**Témoins**\nCosette')
    expect(text).toContain(incidentReport.details)
  })

  it('uses Discord components instead of embeds', () => {
    const [message] = buildIncidentReportMessages(incidentReport)

    expect(message.components[0]).toMatchObject({
      type: ComponentType.Container,
      components: expect.arrayContaining([
        expect.objectContaining({ type: ComponentType.TextDisplay }),
        expect.objectContaining({ type: ComponentType.Separator }),
      ]),
    })
  })

  it('escapes Discord markdown in the short user-supplied fields', () => {
    const [message] = buildIncidentReportMessages({
      ...incidentReport,
      identity: 'Jean **Valjean**',
      location: '<@123> Mission Row',
    })

    const text = getMessageText(message)
    expect(text).toContain('Jean \\*\\*Valjean\\*\\*')
    expect(text).toContain('\\<@123\\> Mission Row')
  })

  it('splits a long report into two messages within the component text limit', () => {
    const details = 'x'.repeat(4000)
    const messages = buildIncidentReportMessages({
      ...incidentReport,
      identity: '*'.repeat(120),
      position: '*'.repeat(120),
      location: '*'.repeat(200),
      nature: '*'.repeat(200),
      witnesses: '*'.repeat(500),
      details,
    })

    expect(messages).toHaveLength(2)

    for (const message of messages) {
      expect.soft(getMessageText(message).length).toBeLessThanOrEqual(4000)
    }

    expect(getMessageText(messages[1])).toContain('Rapport d’incident (suite)')
    expect(messages.map(getMessageText).join('').match(/x/g)).toHaveLength(details.length)
  })

  it('builds a thread name with the incident date and nature', () => {
    const name = buildIncidentReportThreadName(incidentReport)

    expect(name).toMatch(/^\(\d{2}\/\d{2}\/2026\) Vol à main armée$/)
  })

  it('truncates a long nature to keep the thread name within the Discord limit', () => {
    const name = buildIncidentReportThreadName({
      ...incidentReport,
      nature: 'a'.repeat(200),
    })

    expect(name.length).toBeLessThanOrEqual(100)
    expect(name).toMatch(/^\(\d{2}\/\d{2}\/2026\) a+\.\.\.$/)
  })
})

describe('sendIncidentReportNotification', () => {
  beforeEach(() => {
    sendWebhookMessageMock.mockReset()
  })

  it('creates a forum thread with the first message and uses its channel for follow-ups', async () => {
    sendWebhookMessageMock
      .mockResolvedValueOnce({ id: 'message-1', channel_id: 'thread-1' })
      .mockResolvedValueOnce({ id: 'message-2' })

    await sendIncidentReportNotification({
      webhookUrl: 'https://discord.com/api/webhooks/test',
      data: { ...incidentReport, details: 'x'.repeat(4000) },
    })

    expect(sendWebhookMessageMock).toHaveBeenCalledTimes(2)
    expect(sendWebhookMessageMock).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        payload: expect.objectContaining({
          flags: MessageFlags.IsComponentsV2,
          thread_name: expect.stringMatching(/^\(\d{2}\/\d{2}\/2026\) Vol à main armée$/),
          allowed_mentions: { parse: [] },
        }),
        wait: true,
        withComponents: true,
      })
    )
    expect(sendWebhookMessageMock).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        payload: expect.objectContaining({
          flags: MessageFlags.IsComponentsV2,
          allowed_mentions: { parse: [] },
        }),
        threadId: 'thread-1',
        withComponents: true,
      })
    )
  })

  it('sends a single message for a short report', async () => {
    sendWebhookMessageMock.mockResolvedValueOnce({ id: 'message-1', channel_id: 'thread-1' })

    await sendIncidentReportNotification({
      webhookUrl: 'https://discord.com/api/webhooks/test',
      data: incidentReport,
    })

    expect(sendWebhookMessageMock).toHaveBeenCalledTimes(1)
  })
})
