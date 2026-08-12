import { setResponseStatus } from '@tanstack/react-start/server'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  CLERGY_APPLICATION_DISCORD_PENDING_THREAD_TAG,
  clergyApplicationDiscordThreadTag,
} from '#/features/clergy-application/constants/clergy-application.constants.ts'
import * as clergyApplicationService
  from '#/features/clergy-application/server/clergy-application.service.ts'
import {
  CLERGY_APPLICATION_EMBED_COLOR,
} from '#/features/clergy-application/server/clergy-application.service.ts'
import { mockUser } from '../../utils/test-unit.utils.ts'

const postMock = vi.hoisted(() => vi.fn<(url: string, options?: unknown) => Promise<unknown>>())

vi.mock('ky', () => ({
  default: {
    post: postMock,
  },
}))

const CLERGY_WEBHOOK_URL = 'https://discord.com/api/webhooks/test'

const validData = {
  discordUsername: 'john.doe',
  sanctions: 'https://ucp-fr.gta.world/view/record/qqmNX',
  firstname: 'Jean-Marie',
  lastname: 'Vianney',
  age: '32',
  characterStory: 'Un homme qui a ressenti l’appel de Dieu dès son enfance.'.repeat(5),
  motivations: 'Servir la communauté de Los Santos.'.repeat(5),
  noTrollingDeclaration: true,
  legalOnlyDeclaration: true,
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

  it('sends the validated clergy application to the discord webhook in two messages', async () => {
    postMock
      .mockResolvedValueOnce({ json: () => ({ channel_id: '1234567890' }) })
      .mockResolvedValue({ json: () => ({}) })

    const result = await clergyApplicationService.submit({
      data: { role: 'priest', values: validData },
      user: mockUser,
    })

    expect(result).toEqual({ success: true })

    const timestamp = mockDate.toISOString()

    expect(postMock).toHaveBeenNthCalledWith(
      1,
      CLERGY_WEBHOOK_URL,
      expect.objectContaining({
        searchParams: expect.objectContaining({ wait: true }),
        json: {
          thread_name: '[Clergé] Jean-Marie Vianney',
          applied_tags: [
            CLERGY_APPLICATION_DISCORD_PENDING_THREAD_TAG,
            clergyApplicationDiscordThreadTag['priest'],
          ],
          embeds: [
            {
              title: 'Candidature au clergé — Jean-Marie Vianney',
              thumbnail: { url: 'https://i.imgur.com/zkPlrIe.png' },
              color: CLERGY_APPLICATION_EMBED_COLOR,
              fields: [
                { name: 'Pseudo UCP', value: 'Test User', inline: true },
                { name: 'Pseudo Discord', value: 'john.doe', inline: true },
                {
                  name: 'Dossier GTA World',
                  value: 'https://ucp-fr.gta.world/view/record/qqmNX',
                },
                { name: 'Nom du personnage', value: 'Jean-Marie Vianney', inline: true },
                { name: 'Âge du personnage', value: '32 ans', inline: true },
                { name: 'Rôle souhaité', value: 'Prêtre diocésain', inline: true },
              ],
              footer: {
                text: 'LS Catholics - Candidature au clergé',
                icon_url: 'https://i.imgur.com/zkPlrIe.png',
              },
              timestamp,
            },
          ],
        },
      })
    )

    expect(postMock).toHaveBeenNthCalledWith(
      2,
      CLERGY_WEBHOOK_URL,
      expect.objectContaining({
        searchParams: expect.objectContaining({ thread_id: '1234567890' }),
        json: {
          embeds: [
            {
              title: 'Histoire de votre personnage',
              description: validData.characterStory,
            },
            {
              title: 'Pourquoi voulez-vous rejoindre la faction ?',
              description: validData.motivations,
            },
          ],
        },
      })
    )
  })

  it('returns an error and a 500 status when the webhook request fails', async () => {
    postMock.mockRejectedValue(new Error('boom'))

    const result = await clergyApplicationService.submit({
      data: { role: 'priest', values: validData },
      user: mockUser,
    })

    expect(result).toEqual({ success: false, error: 'Une erreur est survenue' })
    expect(setResponseStatus).toHaveBeenCalledWith(500)
  })

  it('returns an error when the webhook is not configured', async () => {
    vi.stubEnv('CLERGY_APPLICATION_DISCORD_WEBHOOK', '')
    vi.resetModules()
    const freshService =
      await import('#/features/clergy-application/server/clergy-application.service.ts')

    const result = await freshService.submit({
      data: { role: 'priest', values: validData },
      user: mockUser,
    })

    expect(result).toEqual({
      success: false,
      error:
        '(( Les candidatures au clergé sont temporairement désactivées. Réessayez plus tard. ))',
    })
    expect(setResponseStatus).toHaveBeenCalledWith(500)
    expect(postMock).not.toHaveBeenCalled()
  })

  it('returns validation errors for invalid data', async () => {
    const result = await clergyApplicationService.submit({
      data: { role: 'priest', values: { ...validData, discordUsername: '' } },
      user: mockUser,
    })

    expect(result.success).toBe(false)
    expect(result.validationErrors).toBeDefined()
    expect(setResponseStatus).toHaveBeenCalledWith(400)
    expect(postMock).not.toHaveBeenCalled()
  })
})
