import { setResponseStatus } from '@tanstack/react-start/server'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  CONTACT_SUBJECT,
  contactSubjectLabels,
} from '#/features/contact/constants/contact-subjects.ts'
import * as contactService from '#/features/contact/server/contact.service.ts'
import { CONTACT_EMBED_COLOR } from '#/features/contact/server/contact.service.ts'
import { mockUser } from '../../utils/test-unit.utils.ts'

const postMock = vi.hoisted(() => vi.fn<(url: string, options?: unknown) => Promise<unknown>>())

vi.mock('ky', () => ({
  default: {
    post: postMock,
  },
}))

const sendContactAcknowledgementMailMock = vi.hoisted(() => vi.fn())

vi.mock('#/features/contact/server/contact-mail.service.ts', () => ({
  sendContactAcknowledgementMail: sendContactAcknowledgementMailMock,
}))

const CONTACT_WEBHOOK_URL = 'https://discord.com/api/webhooks/test'

const validData = {
  firstName: 'Jean',
  lastName: 'Valjean',
  phone: '0123456789',
  subject: CONTACT_SUBJECT.CHANCERY,
  message: 'Bonjour, je souhaite obtenir un document officiel.',
}

beforeEach(() => {
  postMock.mockReset()
  sendContactAcknowledgementMailMock.mockReset()
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

  it('sends the validated contact message to the discord webhook', async () => {
    postMock.mockResolvedValue({})

    const result = await contactService.submit({
      data: validData,
      user: mockUser,
    })

    expect(result).toEqual({ success: true })

    expect(sendContactAcknowledgementMailMock).toHaveBeenCalledWith(
      expect.objectContaining({ firstName: validData.firstName, lastName: validData.lastName })
    )

    const timestamp = mockDate.toISOString()
    expect(postMock).toHaveBeenCalledWith(
      CONTACT_WEBHOOK_URL,
      expect.objectContaining({
        json: {
          thread_name: `${validData.firstName} ${validData.lastName}`.trim(),
          applied_tags: ['1300492266359754813'],
          embeds: expect.arrayContaining([
            {
              title: `Nouvelle demande de contact — ${contactSubjectLabels[validData.subject]}`,
              thumbnail: { url: 'https://i.imgur.com/zkPlrIe.png' },
              color: CONTACT_EMBED_COLOR,
              fields: [
                { name: 'Prénom', value: validData.firstName, inline: true },
                { name: 'Nom', value: validData.lastName, inline: true },
                { name: 'Téléphone', value: String(validData.phone) },
                { name: 'Sujet', value: contactSubjectLabels[validData.subject] },
              ],
              footer: {
                text: 'LS Catholics - Formulaire de contact en ligne',
                icon_url: 'https://i.imgur.com/zkPlrIe.png',
              },
              timestamp,
            },
            {
              title: 'Message',
              description: validData.message,
            },
          ]),
        },
      })
    )
  })

  it('includes the EyefindMail address in the embed and forwards it to the acknowledgement', async () => {
    postMock.mockResolvedValue({})

    const eyefindMail = 'jean.valjean@mail.eyefind.fr'
    await contactService.submit({
      data: { ...validData, eyefindMail },
      user: mockUser,
    })

    const payload = postMock.mock.calls[0][1] as {
      json: { embeds: { fields: { name: string; value: string }[] }[] }
    }
    expect(payload.json.embeds[0].fields).toContainEqual({
      name: 'EyefindMail',
      value: eyefindMail,
    })
    expect(sendContactAcknowledgementMailMock).toHaveBeenCalledWith(
      expect.objectContaining({ eyefindMail })
    )
  })

  it('accepts a submission without a phone number when an EyefindMail address is provided', async () => {
    postMock.mockResolvedValue({})

    const eyefindMail = 'jean.valjean@mail.eyefind.fr'
    const dataWithoutPhone = {
      firstName: validData.firstName,
      lastName: validData.lastName,
      subject: validData.subject,
      message: validData.message,
      eyefindMail,
    }

    const result = await contactService.submit({
      data: dataWithoutPhone,
      user: mockUser,
    })

    expect(result).toEqual({ success: true })

    const payload = postMock.mock.calls[0][1] as {
      json: { embeds: { fields: { name: string; value: string }[] }[] }
    }
    const fieldNames = payload.json.embeds[0].fields.map((field) => field.name)
    expect(fieldNames).not.toContain('Téléphone')
    expect(fieldNames).toContain('EyefindMail')
  })

  it('requires a phone number or an EyefindMail address', async () => {
    const dataWithoutContact = {
      firstName: validData.firstName,
      lastName: validData.lastName,
      subject: validData.subject,
      message: validData.message,
    }

    const result = await contactService.submit({
      data: dataWithoutContact,
      user: mockUser,
    })

    expect(result.success).toBe(false)
    expect(result.validationErrors).toBeDefined()
    expect(setResponseStatus).toHaveBeenCalledWith(400)
    expect(postMock).not.toHaveBeenCalled()
  })

  it('returns an error and a 500 status when the webhook request fails', async () => {
    postMock.mockRejectedValue(new Error('boom'))

    const result = await contactService.submit({
      data: validData,
      user: mockUser,
    })

    expect(result).toEqual({ success: false, error: 'Une erreur est survenue' })
    expect(setResponseStatus).toHaveBeenCalledWith(500)
  })

  it('returns an error when the webhook is not configured', async () => {
    vi.stubEnv('CONTACT_DISCORD_WEBHOOK', '')
    vi.resetModules()
    const freshService = await import('#/features/contact/server/contact.service.ts')

    const result = await freshService.submit({
      data: validData,
      user: mockUser,
    })

    expect(result).toEqual({
      success: false,
      error: 'Le formulaire de contact est temporairement désactivé. Réessayez plus tard.',
    })
    expect(setResponseStatus).toHaveBeenCalledWith(500)
    expect(postMock).not.toHaveBeenCalled()
  })

  it('returns validation errors for invalid data', async () => {
    const result = await contactService.submit({
      data: { ...validData, message: 'court' },
      user: mockUser,
    })

    expect(result.success).toBe(false)
    expect(result.validationErrors).toBeDefined()
    expect(setResponseStatus).toHaveBeenCalledWith(400)
    expect(postMock).not.toHaveBeenCalled()
  })
})
