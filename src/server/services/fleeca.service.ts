import { createHmac, timingSafeEqual } from 'node:crypto'
import ky, { isHTTPError, isNetworkError, isTimeoutError } from 'ky'
import { env } from '#/config/env.server.ts'
import { createEnum } from '#shared/lib/enum.ts'

/**
 * Payment mode used when creating a Fleeca payment.
 * 0 = sandbox (test), 1 = live (production).
 */
export const [FLEECA_PAYMENT_MODE] = createEnum({
  SANDBOX: 0,
  LIVE: 1,
})

export type FleecaPaymentMode =
  (typeof FLEECA_PAYMENT_MODE)[keyof typeof FLEECA_PAYMENT_MODE]

export type FleecaPaymentStatus = 'payment_successful' | 'payment_failed' | 'pending'

export interface FleecaCreatePaymentRequest {
  amount: number
  mode: FleecaPaymentMode
  description?: string
}

export interface FleecaCreatePaymentResponse {
  success: boolean
  payment_id: string
  payment_link: string
  message: string
}

export interface FleecaWebhookPayload {
  payment_id: string
  payment_url: string
  mode: 'sandbox' | 'live'
  amount: number
  payer_routing: string
  payer_name: string | null
  status: FleecaPaymentStatus
  description?: string
  status_reason?: string
  created_at: string
  paid_at: string
}

export interface FleecaPaymentDetails {
  payment_id: string
  merchant_id: number
  amount: number
  description: string | null
  status: FleecaPaymentStatus
  mode: 'live' | 'sandbox'
  payer_routing: string | null
  payer_name: string | null
  paid_at: string | null
  created_at: string
  updated_at: string
}

export class FleecaClientError extends Error {
  readonly status?: number

  constructor(
    message: string,
    readonly code: 'UNCONFIGURED' | 'NETWORK' | 'HTTP' | 'PROCESSING' | 'INVALID_PAYMENT_ID' =
      'PROCESSING',
    options?: ErrorOptions & { status?: number }
  ) {
    super(message, options)
    this.name = 'FleecaClientError'
    this.status = options?.status
  }
}

/**
 * Payment ids are interpolated into the Fleeca API path, so they must be
 * strictly restricted to a safe charset. Anything else could escape the
 * `/payments/{id}` path (path traversal) or hammer the API with garbage.
 *
 * The gateway issues canonical UUIDs (see the documentation), so we only
 * accept that exact shape: rejecting every other value prevents abusing the
 * public status endpoint as a way to burn the global 10 req/min rate budget
 * with arbitrary strings.
 */
const PAYMENT_ID_PATTERN =
  /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/

const REQUEST_TIMEOUT_MS = 15_000

class FleecaClient {
  readonly #apiKey: string | undefined = env.FLEECA_API_KEY
  readonly #baseUrl: string = env.FLEECA_BASE_URL.toString()

  #http: ReturnType<typeof ky.create> | null = null

  #client() {
    if (!this.#apiKey) {
      throw new FleecaClientError(
        'FLEECA_API_KEY is not configured — donations are temporarily unavailable.',
        'UNCONFIGURED'
      )
    }

    if (!this.#http) {
      this.#http = ky.create({
        prefix: this.#baseUrl,
        timeout: REQUEST_TIMEOUT_MS,
        /**
         * Retry on transient server/network errors only. 429 (rate-limit) is
         * intentionally excluded — we respect the limit rather than hammering
         * Fleeca until we get through.
         */
        retry: {
          limit: 3,
          statusCodes: [408, 500, 502, 503, 504],
          backoffLimit: 4_000,
        },
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.#apiKey}`,
        },
      })
    }

    return this.#http
  }

  async createPayment(payload: FleecaCreatePaymentRequest): Promise<FleecaCreatePaymentResponse> {
    try {
      return await this.#client().post('payment', { json: payload }).json<FleecaCreatePaymentResponse>()
    } catch (err) {
      throw this.#toClientError(err, 'createPayment')
    }
  }

  async getPayment(paymentId: string): Promise<FleecaPaymentDetails> {
    if (!PAYMENT_ID_PATTERN.test(paymentId)) {
      throw new FleecaClientError(`Invalid Fleeca payment id "${paymentId}"`, 'INVALID_PAYMENT_ID')
    }

    try {
      const res = await this.#client()
        .get(`payments/${paymentId}`)
        .json<{ success: boolean; data?: FleecaPaymentDetails | null }>()
      if (!res.data) {
        throw new FleecaClientError(
          `Fleeca API response for "${paymentId}" has no data`,
          'PROCESSING'
        )
      }
      return res.data
    } catch (err) {
      throw this.#toClientError(err, 'getPayment')
    }
  }

  /**
   * Verify the HMAC-SHA256 signature sent by Fleeca in `X-Fleeca-Signature`.
   *
   * IMPORTANT: `rawBody` must be the **raw** request body string, not a
   * re-serialised parsed object — whitespace differences would break the check.
   */
  verifyWebhookSignature(rawBody: string, signature: string): boolean {
    if (!this.#apiKey || !signature.startsWith('sha256=')) return false

    const expected = `sha256=${createHmac('sha256', this.#apiKey).update(rawBody).digest('hex')}`

    try {
      return timingSafeEqual(Buffer.from(expected, 'utf8'), Buffer.from(signature, 'utf8'))
    } catch {
      return false
    }
  }

  #toClientError(err: unknown, context: string): FleecaClientError {
    if (err instanceof FleecaClientError) {
      return err
    }
    if (isTimeoutError(err) || isNetworkError(err)) {
      return new FleecaClientError(`Fleeca API network error in ${context}`, 'NETWORK', {
        cause: err,
      })
    }
    if (isHTTPError(err)) {
      const status = err.response.status
      return new FleecaClientError(`Fleeca API HTTP error in ${context}`, 'HTTP', {
        cause: err,
        status,
      })
    }
    return new FleecaClientError(`Fleeca API processing error in ${context}`, 'PROCESSING', {
      cause: err,
    })
  }
}

export const fleecaClient = new FleecaClient()
