import { beforeEach, describe, expect, it, vi } from 'vitest'
import { sendDonationConfirmationMail } from '#/features/donate/server/donation-mail.service.ts'
import type { DonationNotificationData } from '#/features/donate/types/donate.types.ts'

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

const validData: DonationNotificationData = {
  amount: 500,
  firstname: 'Jean',
  lastname: 'Valjean',
  age: 46,
  ethnicity: 'white',
  phone: '123456',
  address: '12 Ginger Street',
  district: 'little_seoul',
  eyefindMail: 'jean.valjean@mail.eyefind.fr',
  isOrganization: false,
  organizationName: undefined,
  message: undefined,
  anonymous: false,
}

beforeEach(() => {
  mocks.sendEyefindMail.mockReset()
})

describe('sendDonationConfirmationMail', () => {
  it('does nothing when no EyefindMail address was provided', async () => {
    await sendDonationConfirmationMail({ ...validData, eyefindMail: undefined })

    expect(mocks.sendEyefindMail).not.toHaveBeenCalled()
  })

  it('sends a confirmation mail to the given EyefindMail address', async () => {
    mocks.sendEyefindMail.mockResolvedValue({ messageId: 1, warnings: [] })

    await sendDonationConfirmationMail(validData)

    expect(mocks.sendEyefindMail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'jean.valjean@mail.eyefind.fr',
        subject: 'Merci pour votre don — Gracias por su donación | LS Catholics',
      })
    )

    const payload = mocks.sendEyefindMail.mock.calls[0][0] as {
      body: string
      html: string
    }
    expect(payload.body).toContain('Bonjour Jean Valjean')
    expect(payload.body).toContain('votre don de $500')
    expect(payload.body).toContain('Hola Jean Valjean')
    expect(payload.body).toContain('su donación de $500')
    expect(payload.html).toContain('<p>Bonjour <strong>Jean Valjean</strong>,</p>')
    expect(payload.html).toContain('<strong>$500</strong>')
    expect(payload.html).toContain('<p>Hola <strong>Jean Valjean</strong>,</p>')
  })

  it('mentions the organization when the donation is made on its behalf', async () => {
    mocks.sendEyefindMail.mockResolvedValue({ messageId: 1, warnings: [] })

    await sendDonationConfirmationMail({
      ...validData,
      isOrganization: true,
      organizationName: 'Doe Corporation',
    })

    const payload = mocks.sendEyefindMail.mock.calls[0][0] as {
      body: string
      html: string
    }
    expect(payload.body).toContain('votre don de $500 réalisé au nom de Doe Corporation')
    expect(payload.body).toContain('Nous prierons également pour Doe Corporation.')
    expect(payload.body).toContain('su donación de $500 realizada a nombre de Doe Corporation')
    expect(payload.body).toContain('También rezaremos por Doe Corporation.')
    expect(payload.html).toContain('réalisé au nom de <strong>Doe Corporation</strong>')
    expect(payload.html).toContain('También rezaremos por <strong>Doe Corporation</strong>.')
  })

  it('escapes user content embedded in the html', async () => {
    mocks.sendEyefindMail.mockResolvedValue({ messageId: 1, warnings: [] })

    await sendDonationConfirmationMail({
      ...validData,
      firstname: '</strong><script>alert(1)</script>',
    })

    const payload = mocks.sendEyefindMail.mock.calls[0][0] as { html: string }
    expect(payload.html).not.toContain('<script>')
    expect(payload.html).toContain('&lt;/strong&gt;')
  })

  it('swallows Eyefind errors so the payment flow is not affected', async () => {
    mocks.sendEyefindMail.mockRejectedValue(
      new mocks.EyefindMailError('rate limited', 'rate_limited', 429)
    )

    await expect(sendDonationConfirmationMail(validData)).resolves.toBeUndefined()
  })
})
