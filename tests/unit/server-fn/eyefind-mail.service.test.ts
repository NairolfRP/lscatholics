import { beforeEach, describe, expect, it, vi } from 'vitest'
import { sendEyefindMail } from '#server/services/eyefind-mail.service.ts'
import type { EyefindMailError } from '#server/services/eyefind-mail.service.ts'

const mocks = vi.hoisted(() => {
  class HTTPError extends Error {
    readonly response: { status: number; json: () => Promise<unknown> }

    constructor(status: number, body: unknown) {
      super('Request failed')
      this.response = { status, json: vi.fn().mockResolvedValue(body) }
    }
  }

  class NetworkError extends Error {}
  class TimeoutError extends Error {}

  return {
    postMock: vi.fn(),
    HTTPError,
    NetworkError,
    TimeoutError,
  }
})

vi.mock('ky', () => ({
  default: { post: mocks.postMock },
  isHTTPError: (err: unknown) => err instanceof mocks.HTTPError,
  isNetworkError: (err: unknown) => err instanceof mocks.NetworkError,
  isTimeoutError: (err: unknown) => err instanceof mocks.TimeoutError,
}))

beforeEach(() => {
  mocks.postMock.mockReset()
})

function jsonResponse(value: unknown) {
  return { json: vi.fn().mockResolvedValue(value) }
}

describe('sendEyefindMail', () => {
  it('posts the mail payload with the Bearer api key header', async () => {
    mocks.postMock.mockResolvedValue(jsonResponse({ ok: true, message_id: 42 }))

    const result = await sendEyefindMail({
      to: 'jean.valjean@mail.eyefind.fr',
      subject: 'Votre don a bien été reçu — LS Catholics',
      body: 'Merci pour votre don !',
    })

    expect(mocks.postMock).toHaveBeenCalledWith(
      'https://eyefind.fr/bot-api/mail/send',
      expect.objectContaining({
        headers: { Authorization: 'Bearer fake-eyefind-mail-api-key' },
        json: expect.objectContaining({ to: 'jean.valjean@mail.eyefind.fr' }),
        retry: 0,
      })
    )
    expect(result).toEqual({ messageId: 42, warnings: [] })
  })

  it('returns the sanitization warnings from the response', async () => {
    mocks.postMock.mockResolvedValue(
      jsonResponse({ ok: true, message_id: 7, warnings: ['html_sanitized'] })
    )

    const result = await sendEyefindMail({
      to: 'jean.valjean@mail.eyefind.fr',
      subject: 'Test',
      body: 'Test',
      html: '<p>Test</p>',
    })

    expect(result).toEqual({ messageId: 7, warnings: ['html_sanitized'] })
  })

  it('maps a rejected request with an error body into an EyefindMailError', async () => {
    mocks.postMock.mockRejectedValue(new mocks.HTTPError(429, { error: 'rate_limited' }))

    await expect(
      sendEyefindMail({ to: 'a@mail.eyefind.fr', subject: 'Test', body: 'Test' })
    ).rejects.toMatchObject<Partial<EyefindMailError>>({ code: 'rate_limited', status: 429 })
  })

  it('maps a network error into an EyefindMailError', async () => {
    mocks.postMock.mockRejectedValue(new mocks.NetworkError('no network'))

    await expect(
      sendEyefindMail({ to: 'a@mail.eyefind.fr', subject: 'Test', body: 'Test' })
    ).rejects.toMatchObject<Partial<EyefindMailError>>({ code: 'NETWORK' })
  })

  it('maps a timeout error into an EyefindMailError', async () => {
    mocks.postMock.mockRejectedValue(new mocks.TimeoutError('timed out'))

    await expect(
      sendEyefindMail({ to: 'a@mail.eyefind.fr', subject: 'Test', body: 'Test' })
    ).rejects.toMatchObject<Partial<EyefindMailError>>({ code: 'NETWORK' })
  })
})
