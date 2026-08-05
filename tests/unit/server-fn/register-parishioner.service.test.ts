import { setResponseStatus } from '@tanstack/react-start/server'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import * as registerParishionerService
  from '#/features/parishioner/server/register-parishioner.service.ts'
import {
  PARISHIONER_EMBED_COLOR,
} from '#/features/parishioner/server/register-parishioner.service.ts'
import { mockUser } from '../../utils/test-unit.utils.ts'

const postMock = vi.hoisted(() => vi.fn<(url: string, options?: unknown) => Promise<unknown>>())

vi.mock('ky', () => ({
  default: {
    post: postMock,
  },
}))

const PARISHIONER_WEBHOOK_URL = 'https://discord.com/api/webhooks/test'

const validData = {
  civilTitle: 'mr',
  maritalStatus: 'married',
  firstname: 'Jean',
  lastname: 'Valjean',
  gender: 'male',
  age: '46',
  ethnicCommunity: 'french',
  occupation: 'Charpentier',
  phone: '123456',
  emergencyPhone: '',
  address: '12 Ginger Street',
  district: 'little_seoul',
  baptized: 'yes',
  religion: 'catholic',
  parish: 'cathedral',
  isVolunteer: true,
  familyMembers: [
    { firstname: 'Cosette', lastname: 'Valjean', age: '19', role: 'daughter', isNpc: false },
  ],
  message: 'Bonjour, je souhaite rencontrer le curé.',
  characterSacraments: ['baptism', 'first_communion', 'confirmation'],
  oocAdditionalInformation: 'Ancien forçat.',
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

  it('sends the validated parishioner registration to the discord webhook in two messages', async () => {
    postMock
      .mockResolvedValueOnce({ json: async () => ({ channel_id: '1234567890' }) })
      .mockResolvedValue({ json: async () => ({}) })

    const result = await registerParishionerService.submit({
      data: validData,
      user: mockUser,
    })

    expect(result).toEqual({ success: true })

    const timestamp = mockDate.toISOString()

    expect(postMock).toHaveBeenNthCalledWith(
      1,
      PARISHIONER_WEBHOOK_URL,
      expect.objectContaining({
        searchParams: expect.objectContaining({ wait: true }),
        json: {
          thread_name: `Foyer de ${validData.firstname} ${validData.lastname}`,
          applied_tags: ['1254696138586718289'],
          embeds: [
            {
              title: `Nouvelle inscription — Foyer de ${validData.firstname} ${validData.lastname}`,
              thumbnail: { url: 'https://i.imgur.com/zkPlrIe.png' },
              color: PARISHIONER_EMBED_COLOR,
              fields: [
                { name: 'Titre de civilité', value: 'Monsieur', inline: true },
                { name: 'État matrimonial', value: 'Marié(e)', inline: true },
                { name: 'Identité', value: 'Jean Valjean', inline: true },
                { name: 'Sexe', value: 'Homme', inline: true },
                { name: 'Âge', value: '46 ans', inline: true },
                { name: 'Communauté ethnique', value: 'Français', inline: true },
                { name: 'Activité / emploi', value: 'Charpentier', inline: true },
                { name: 'Numéro de téléphone', value: '123456', inline: true },
                { name: "N° à appeler en cas d'urgence", value: 'N/A', inline: true },
                { name: 'Adresse', value: '12 Ginger Street (Little Seoul)' },
                { name: 'Baptisé', value: '✅ Oui', inline: true },
                { name: 'Religion', value: 'Catholique', inline: true },
                { name: 'Paroisse', value: 'Cathédrale Notre-Dame-des-Saints' },
                { name: 'Contactable pour du bénévolat', value: '✅ Oui' },
              ],
              footer: {
                text: 'LS Catholics - Enregistrement des paroissiens',
                icon_url: 'https://i.imgur.com/zkPlrIe.png',
              },
              timestamp,
            },
            {
              title: 'Informations complémentaires',
              description: validData.message,
            },
            {
              title: 'Membres du foyer (1)',
              description: '* Cosette Valjean (19 ans - Fille)',
            },
          ],
        },
      })
    )

    expect(postMock).toHaveBeenNthCalledWith(
      2,
      PARISHIONER_WEBHOOK_URL,
      expect.objectContaining({
        searchParams: expect.objectContaining({ thread_id: '1234567890' }),
        json: {
          embeds: [
            {
              title: '(( Partie OOC ))',
              description:
                "**Votre personnage a reçu les sacrements de...** :\nBaptême, Première communion, Confirmation\n\n**Qu'est-ce que le clergé de l'archidiocèse de Los Santos est censé savoir en RP sur votre personnage ?**\n>>> Ancien forçat.",
            },
          ],
        },
      })
    )
  })

  it('only creates the forum thread when there is no OOC content to send', async () => {
    postMock.mockResolvedValueOnce({ json: async () => ({ channel_id: '1234567890' }) })

    const result = await registerParishionerService.submit({
      data: { ...validData, characterSacraments: [], oocAdditionalInformation: '' },
      user: mockUser,
    })

    expect(result).toEqual({ success: true })
    expect(postMock).toHaveBeenCalledTimes(1)
    expect(postMock).toHaveBeenCalledWith(
      PARISHIONER_WEBHOOK_URL,
      expect.objectContaining({
        searchParams: expect.objectContaining({ wait: true }),
      })
    )
  })

  it('returns an error and a 500 status when the webhook request fails', async () => {
    postMock.mockRejectedValue(new Error('boom'))

    const result = await registerParishionerService.submit({
      data: validData,
      user: mockUser,
    })

    expect(result).toEqual({ success: false, error: 'Une erreur est survenue' })
    expect(setResponseStatus).toHaveBeenCalledWith(500)
  })

  it('returns an error when the webhook is not configured', async () => {
    vi.stubEnv('PARISHIONER_REGISTRATION_DISCORD_WEBHOOK', '')
    vi.resetModules()
    const freshService =
      await import('#/features/parishioner/server/register-parishioner.service.ts')

    const result = await freshService.submit({
      data: validData,
      user: mockUser,
    })

    expect(result).toEqual({
      success: false,
      error: "L'enregistrement des paroissiens est temporairement désactivé. Réessayez plus tard.",
    })
    expect(setResponseStatus).toHaveBeenCalledWith(500)
    expect(postMock).not.toHaveBeenCalled()
  })

  it('returns validation errors for invalid data', async () => {
    const result = await registerParishionerService.submit({
      data: { ...validData, firstname: '' },
      user: mockUser,
    })

    expect(result.success).toBe(false)
    expect(result.validationErrors).toBeDefined()
    expect(setResponseStatus).toHaveBeenCalledWith(400)
    expect(postMock).not.toHaveBeenCalled()
  })
})
