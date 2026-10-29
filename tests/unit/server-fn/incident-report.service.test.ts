import { setResponseStatus } from '@tanstack/react-start/server'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import * as incidentReportService from '#/features/incident-report/server/incident-report.service.ts'
import { mockUser } from '../../utils/test-unit.utils.ts'

const sendIncidentReportNotificationMock = vi.hoisted(() => vi.fn())

vi.mock('#/features/incident-report/server/incident-report-notification.service.ts', () => ({
  sendIncidentReportNotification: sendIncidentReportNotificationMock,
}))

const validData = {
  identity: 'Jean Valjean',
  position: 'Superviseur',
  incidentAt: new Date('2026-08-05T14:09:05.100Z'),
  location: 'Mission Row',
  nature: 'Vol à main armée',
  witnesses: 'Cosette',
  details: 'Un individu masqué a dérobé la caisse avant de prendre la fuite vers le sud.',
}

beforeEach(() => {
  sendIncidentReportNotificationMock.mockReset()
})

afterEach(() => {
  vi.unstubAllEnvs()
})

describe('submit', () => {
  it('validates the report and sends it to Discord', async () => {
    sendIncidentReportNotificationMock.mockResolvedValue(undefined)

    const result = await incidentReportService.submit({ data: validData, user: mockUser })

    expect(result).toEqual({ success: true })
    expect(sendIncidentReportNotificationMock).toHaveBeenCalledWith({
      webhookUrl: 'https://discord.com/api/webhooks/test',
      data: expect.objectContaining({
        identity: validData.identity,
        details: validData.details,
      }),
    })
  })

  it('returns validation errors without sending anything', async () => {
    const result = await incidentReportService.submit({
      data: { ...validData, details: 'Trop court' },
      user: mockUser,
    })

    expect(result.success).toBe(false)
    expect(result.validationErrors).toBeDefined()
    expect(setResponseStatus).toHaveBeenCalledWith(400)
    expect(sendIncidentReportNotificationMock).not.toHaveBeenCalled()
  })

  it('returns a generic error when the Discord notification fails', async () => {
    sendIncidentReportNotificationMock.mockRejectedValue(new Error('boom'))

    const result = await incidentReportService.submit({ data: validData, user: mockUser })

    expect(result).toEqual({ success: false, error: 'Une erreur est survenue' })
    expect(setResponseStatus).toHaveBeenCalledWith(500)
  })
})
