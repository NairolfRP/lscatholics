import ky, { isHTTPError, isNetworkError, isTimeoutError } from 'ky'
import { env } from '#/config/env.server.ts'

export const EYEFIND_MAIL_BASE_URL = 'https://eyefind.fr/bot-api'
const REQUEST_TIMEOUT = 10_000

export interface SendEyefindMailInput {
  to: string
  subject: string
  body: string
  html?: string
}

export interface SendEyefindMailResult {
  messageId: number
  warnings: string[]
}

export class EyefindMailError extends Error {
  constructor(
    message: string,
    readonly code: string,
    readonly status?: number,
    options?: ErrorOptions
  ) {
    super(message, options)
    this.name = 'EyefindMailError'
  }
}

export async function sendEyefindMail(input: SendEyefindMailInput): Promise<SendEyefindMailResult> {
  const apiKey = env.EYEFIND_MAIL_API_KEY
  if (!apiKey) {
    throw new EyefindMailError('EYEFIND_MAIL_API_KEY is not configured', 'UNCONFIGURED')
  }

  try {
    const response = await ky.post(`${EYEFIND_MAIL_BASE_URL}/mail/send`, {
      headers: { Authorization: `Bearer ${apiKey}` },
      json: input,
      timeout: REQUEST_TIMEOUT,
      retry: 0,
    })

    const data = await response.json<{ ok: true; message_id: number; warnings?: string[] }>()
    return { messageId: data.message_id, warnings: data.warnings ?? [] }
  } catch (err) {
    throw await toEyefindMailError(err)
  }
}

async function toEyefindMailError(err: unknown): Promise<EyefindMailError> {
  if (err instanceof EyefindMailError) return err

  if (isHTTPError(err)) {
    const status = err.response.status
    let code = 'API_ERROR'

    try {
      const body = await err.response.json<{ error?: string }>()
      if (body.error) code = body.error
    } catch {
      // response body is not JSON, keep the default code
    }

    return new EyefindMailError('Eyefind mail API request rejected', code, status, { cause: err })
  }

  if (isTimeoutError(err) || isNetworkError(err)) {
    return new EyefindMailError('Eyefind mail API network error', 'NETWORK', undefined, {
      cause: err,
    })
  }

  return new EyefindMailError('Eyefind mail API error', 'API_ERROR', undefined, { cause: err })
}
