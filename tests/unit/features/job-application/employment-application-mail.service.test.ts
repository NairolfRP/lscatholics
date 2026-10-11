import { beforeEach, describe, expect, it, vi } from 'vitest'
import { employmentApplicationSchema } from '#/features/job-application/schemas/employment-application.schema.ts'
import {
  EMPLOYMENT_APPLICATION_MAIL_SUBJECT,
  sendEmploymentApplicationAcknowledgementMail,
} from '#/features/job-application/server/employment-application-mail.service.ts'

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

const validData = employmentApplicationSchema.parse({
  firstname: 'Jean',
  lastname: 'Valjean',
  middleName: '',
  age: '30',
  gender: 'male',
  district: 'little_seoul',
  address: '12 Ginger Street',
  phone: '12345678',
  eyefindMail: 'jean.valjean@mail.eyefind.fr',
  iban: '010012345',
  isPracticingCatholic: true,
  hasDriverLicense: false,
  applicationSource: { type: null, employeeReferral: '' },
  education: { highestLevel: 'highSchoolDiploma', fieldOfStudy: '' },
  spokenLanguages: [],
  professionalExperience: [],
  applicantDeclarationAccepted: true,
  discordUsername: 'jean.valjean',
  motivationsOOC: '',
})

beforeEach(() => {
  mocks.sendEyefindMail.mockReset()
})

describe('sendEmploymentApplicationAcknowledgementMail', () => {
  it('does nothing when no EyefindMail address was provided', async () => {
    await sendEmploymentApplicationAcknowledgementMail({ ...validData, eyefindMail: undefined })

    expect(mocks.sendEyefindMail).not.toHaveBeenCalled()
  })

  it('sends an acknowledgement to the given EyefindMail address', async () => {
    mocks.sendEyefindMail.mockResolvedValue({ messageId: 1, warnings: [] })

    await sendEmploymentApplicationAcknowledgementMail(validData)

    expect(mocks.sendEyefindMail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'jean.valjean@mail.eyefind.fr',
        subject: EMPLOYMENT_APPLICATION_MAIL_SUBJECT,
      })
    )

    const payload = mocks.sendEyefindMail.mock.calls[0][0] as { body: string; html: string }
    expect(payload.body).toContain('Madame, Monsieur,')
    expect(payload.body).toContain(
      'Nous accusons réception des informations que vous nous avez transmises concernant votre parcours.'
    )
    expect(payload.body).toContain('nous vous contacterons dans les 7 prochains jours')
    expect(payload.body).toContain('Département des Ressources Humaines')
    expect(payload.body).toContain('Archidiocèse de Los Santos')
    expect(payload.body).not.toContain('https://lscatholics.vercel.app')
    expect(payload.html).toContain('Madame, Monsieur,</p>')
    expect(payload.html).toContain(
      'Département des Ressources Humaines<br>Archidiocèse de Los Santos'
    )
    expect(payload.html).toContain('https://i.imgur.com/6YJtfqY.png')
  })

  it('swallows Eyefind errors so the application is not affected', async () => {
    mocks.sendEyefindMail.mockRejectedValue(
      new mocks.EyefindMailError('rate limited', 'rate_limited', 429)
    )

    await expect(sendEmploymentApplicationAcknowledgementMail(validData)).resolves.toBeUndefined()
  })
})
