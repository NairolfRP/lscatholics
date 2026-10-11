import { beforeEach, describe, expect, it, vi } from 'vitest'
import { CONTACT_SUBJECT } from '#/features/contact/constants/contact-subjects.ts'
import type { ContactFormOutput } from '#/features/contact/schemas/contact.schema.ts'
import { sendContactAcknowledgementMail } from '#/features/contact/server/contact-mail.service.ts'

const mocks = vi.hoisted(() => {
  class EyefindMailError extends Error {
    constructor(
      message: string,
      readonly code: string,
      readonly status?: number
    ) {
      super(message)
      this.name = 'EyefindMailError'
    }
  }

  return {
    sendEyefindMail: vi.fn(),
    EyefindMailError,
  }
})

vi.mock('#server/services/eyefind-mail.service.ts', () => ({
  sendEyefindMail: mocks.sendEyefindMail,
  EyefindMailError: mocks.EyefindMailError,
}))

const validData: ContactFormOutput = {
  firstName: 'Jean',
  lastName: 'Valjean',
  phone: '0123456789',
  eyefindMail: 'jean.valjean@mail.eyefind.fr',
  subject: CONTACT_SUBJECT.CHANCERY,
  message: 'Bonjour, je souhaite obtenir un document officiel.',
}

beforeEach(() => {
  mocks.sendEyefindMail.mockReset()
})

describe('sendContactAcknowledgementMail', () => {
  it('does nothing when no EyefindMail address was provided', async () => {
    await sendContactAcknowledgementMail({ ...validData, eyefindMail: undefined })

    expect(mocks.sendEyefindMail).not.toHaveBeenCalled()
  })

  it('sends an acknowledgement to the given EyefindMail address', async () => {
    mocks.sendEyefindMail.mockResolvedValue({ messageId: 1, warnings: [] })

    await sendContactAcknowledgementMail(validData)

    expect(mocks.sendEyefindMail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'jean.valjean@mail.eyefind.fr',
        subject: 'Votre demande de contact - LS Catholics',
      })
    )

    const payload = mocks.sendEyefindMail.mock.calls[0][0] as { body: string; html: string }
    expect(payload.body).toContain('Bonjour Jean Valjean')
    expect(payload.body).toContain('Chancellerie')
    expect(payload.body).toContain('Retrouvez-nous sur : https://lscatholics.vercel.app')
    expect(payload.body).toContain(
      'Suivez-nous sur Facebrowser : https://face-fr.gta.world/page/lscatholics'
    )
    expect(payload.html).toContain('Bonjour <strong>Jean Valjean</strong>,</p>')
    expect(payload.html).toContain('Chancellerie')
    expect(payload.html).toContain('https://i.imgur.com/6YJtfqY.png')
    expect(payload.html).toContain('https://lscatholics.vercel.app')
    expect(payload.html).toContain('https://face-fr.gta.world/page/lscatholics')
  })

  it('escapes user content embedded in the html', async () => {
    mocks.sendEyefindMail.mockResolvedValue({ messageId: 1, warnings: [] })

    await sendContactAcknowledgementMail({
      ...validData,
      firstName: '</strong><script>alert(1)</script>',
    })

    const payload = mocks.sendEyefindMail.mock.calls[0][0] as { html: string }
    expect(payload.html).not.toContain('<script>')
    expect(payload.html).toContain('&lt;/strong&gt;')
  })

  it('swallows Eyefind errors so the contact form is not affected', async () => {
    mocks.sendEyefindMail.mockRejectedValue(
      new mocks.EyefindMailError('rate limited', 'rate_limited', 429)
    )

    await expect(sendContactAcknowledgementMail(validData)).resolves.toBeUndefined()
  })
})
