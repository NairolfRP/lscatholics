import { setResponseStatus } from '@tanstack/react-start/server'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  APPLICATION_SOURCE,
  REQUIRED_HOURS_REASON,
  SPOKEN_LANGUAGE,
} from '#/features/volunteers/constants/volunteer.constants.ts'
import * as volunteerApplicationService
  from '#/features/volunteers/server/volunteer-application.service.ts'
import {
  VOLUNTEER_APPLICATION_EMBED_COLOR,
} from '#/features/volunteers/server/volunteer-application.service.ts'
import { mockUser } from '../../utils/test-unit.utils.ts'

const postMock = vi.hoisted(() => vi.fn<(url: string, options?: unknown) => Promise<unknown>>())

vi.mock('ky', () => ({
  default: {
    post: postMock,
  },
}))

const VOLUNTEER_WEBHOOK_URL = 'https://discord.com/api/webhooks/test'

const validData = {
  firstname: 'Jean',
  middleName: 'Claude',
  lastname: 'Valjean',
  age: '46',
  address: '12 Ginger Street',
  district: 'little_seoul',
  phone: '123456',
  emergencyPhone: '654321',
  interestedActivities: 'Distributions alimentaires et accompagnement.',
  otherLanguages: [SPOKEN_LANGUAGE.SPANISH],
  ethnicity: 'white',
  applicantSource: {
    type: APPLICATION_SOURCE.EMPLOYEE_REFERRAL,
    employeeReferral: 'Cosette Valjean',
  },
  volunteerAvailability: 'Weekends et soirées.',
  requiredHours: {
    reason: REQUIRED_HOURS_REASON.COURT_ORDERED,
    deadline: '31/12/2026',
  },
}

beforeEach(() => {
  postMock.mockReset()
})

afterEach(() => {
  vi.unstubAllEnvs()
})

describe('submit', () => {
  const mockDate = new Date('2026-08-05T14:09:05.100Z')

  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(mockDate)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('sends the validated volunteer application to the discord webhook in two messages', async () => {
    postMock
      .mockResolvedValueOnce({ json: async () => ({ channel_id: '1234567890' }) })
      .mockResolvedValue({ json: async () => ({}) })

    const result = await volunteerApplicationService.submit({
      data: validData,
      user: mockUser,
    })

    expect(result).toEqual({ success: true })

    const timestamp = mockDate.toISOString()

    expect(postMock).toHaveBeenNthCalledWith(
      1,
      VOLUNTEER_WEBHOOK_URL,
      expect.objectContaining({
        searchParams: expect.objectContaining({ wait: true }),
        json: {
          thread_name: '[Bénévolat] Jean C. Valjean',
          embeds: [
            {
              title: 'Candidature bénévole — Jean C. Valjean',
              thumbnail: { url: 'https://i.imgur.com/zkPlrIe.png' },
              color: VOLUNTEER_APPLICATION_EMBED_COLOR,
              fields: [
                { name: 'Identité', value: 'Jean C. Valjean', inline: true },
                { name: 'Âge', value: '46 ans', inline: true },
                { name: 'Adresse', value: '12 Ginger Street (Little Seoul)' },
                { name: 'Numéro de téléphone', value: '123456', inline: true },
                { name: "N° à appeler en cas d'urgence", value: '654321', inline: true },
                { name: 'Ethnie', value: 'Blanc', inline: true },
                {
                  name: 'Comment avez-vous entendu parler de ce bénévolat ?',
                  value: "Par un employé de l'Archidiocèse",
                  inline: true,
                },
                { name: 'Employé référent', value: 'Cosette Valjean', inline: true },
              ],
              footer: {
                text: 'LS Catholics - Candidature au bénévolat',
                icon_url: 'https://i.imgur.com/zkPlrIe.png',
              },
              timestamp,
            },
            {
              title:
                'CANDIDATURE DANS LE CADRE D’UNE OBLIGATION DE RÉALISER UN SERVICE COMMUNAUTAIRE OU UN BÉNÉVOLAT',
              description:
                "**Motif** : Travaux d'intérêt général ordonnés par le tribunal\n**Date limite pour valider les heures** : 31/12/2026",
            },
          ],
        },
      })
    )

    expect(postMock).toHaveBeenNthCalledWith(
      2,
      VOLUNTEER_WEBHOOK_URL,
      expect.objectContaining({
        searchParams: expect.objectContaining({ thread_id: '1234567890' }),
        json: {
          embeds: [
            {
              title: 'Engagement & disponibilités',
              description:
                '**Autres langues maîtrisées**\n* Espagnol\n\n**Quels types de tâches ou d\'activités vous intéresseraient ?**\nDistributions alimentaires et accompagnement.\n\n**Disponibilités hebdomadaires pour le bénévolat**\nWeekends et soirées.',
            },
          ],
        },
      })
    )
  })

  it('only creates the forum thread when there is no optional content', async () => {
    postMock.mockResolvedValueOnce({ json: async () => ({ channel_id: '1234567890' }) })

    const result = await volunteerApplicationService.submit({
      data: {
        ...validData,
        middleName: '',
        emergencyPhone: '',
        interestedActivities: '',
        otherLanguages: [],
        ethnicity: '',
        applicantSource: { type: '', employeeReferral: '' },
        volunteerAvailability: '',
        requiredHours: { reason: '', deadline: '' },
      },
      user: mockUser,
    })

    expect(result).toEqual({ success: true })
    expect(postMock).toHaveBeenCalledTimes(1)
    expect(postMock).toHaveBeenCalledWith(
      VOLUNTEER_WEBHOOK_URL,
      expect.objectContaining({
        searchParams: expect.objectContaining({ wait: true }),
      })
    )
  })

  it('returns an error and a 500 status when the webhook request fails', async () => {
    postMock.mockRejectedValue(new Error('boom'))

    const result = await volunteerApplicationService.submit({
      data: validData,
      user: mockUser,
    })

    expect(result).toEqual({ success: false, error: 'Une erreur est survenue' })
    expect(setResponseStatus).toHaveBeenCalledWith(500)
  })

  it('returns an error when the webhook is not configured', async () => {
    vi.stubEnv('VOLUNTEER_APPLICATION_DISCORD_WEBHOOK', '')
    vi.resetModules()
    const freshService =
      await import('#/features/volunteers/server/volunteer-application.service.ts')

    const result = await freshService.submit({
      data: validData,
      user: mockUser,
    })

    expect(result).toEqual({
      success: false,
      error: 'Les candidatures de bénévolat sont temporairement désactivées. Réessayez plus tard.',
    })
    expect(setResponseStatus).toHaveBeenCalledWith(500)
    expect(postMock).not.toHaveBeenCalled()
  })

  it('returns validation errors for invalid data', async () => {
    const result = await volunteerApplicationService.submit({
      data: { ...validData, firstname: '' },
      user: mockUser,
    })

    expect(result.success).toBe(false)
    expect(result.validationErrors).toBeDefined()
    expect(setResponseStatus).toHaveBeenCalledWith(400)
    expect(postMock).not.toHaveBeenCalled()
  })
})
