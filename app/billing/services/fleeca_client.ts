import ky, { isHTTPError, isNetworkError, isTimeoutError, type KyInstance } from 'ky'
import { createHmac, timingSafeEqual } from 'node:crypto'
import fleecaConfig from '#config/fleeca'
import type {
  FleecaCreatePaymentRequest,
  FleecaCreatePaymentResponse,
  FleecaPaymentDetails,
} from '#billing/types/payment'
import PaymentException from '#billing/exceptions/payment_exception'

export class FleecaClient {
  readonly #apiKey: string
  readonly #http: KyInstance

  constructor() {
    this.#apiKey = fleecaConfig.apiKey.release()

    this.#http = ky.create({
      prefix: fleecaConfig.baseUrl,
      timeout: fleecaConfig.timeout,
      /**
       * Retry on transient server/network errors only.
       * 429 (rate-limit) is intentionally excluded — we respect the limit rather
       * than hammering Fleeca until we get through.
       */
      retry: {
        limit: 3,
        statusCodes: [408, 500, 502, 503, 504],
        backoffLimit: 4_000,
      },
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.#apiKey}`,
      },
    })
  }

  async createPayment(payload: FleecaCreatePaymentRequest): Promise<FleecaCreatePaymentResponse> {
    try {
      return await this.#http
        .post('/payment', { json: payload })
        .json<FleecaCreatePaymentResponse>()
    } catch (err) {
      return this.#handleError(err, 'createPayment')
    }
  }

  async getPayment(paymentId: string): Promise<FleecaPaymentDetails> {
    try {
      const res = await this.#http
        .get(`/payments/${paymentId}`)
        .json<{ success: boolean; data: FleecaPaymentDetails }>()
      return res.data
    } catch (err) {
      return this.#handleError(err, 'getPayment')
    }
  }

  /**
   * Verify the HMAC-SHA256 signature sent by Fleeca in `X-Fleeca-Signature`.
   *
   * IMPORTANT: `rawBody` must be the **raw** request body string, not a
   * re-serialised parsed object — whitespace differences would break the check.
   */
  verifyWebhookSignature(rawBody: string, signature: string): boolean {
    if (!signature.startsWith('sha256=')) return false

    const expected = `sha256=${createHmac('sha256', this.#apiKey).update(rawBody).digest('hex')}`

    try {
      return timingSafeEqual(Buffer.from(expected, 'utf8'), Buffer.from(signature, 'utf8'))
    } catch {
      return false
    }
  }

  #handleError(err: unknown, context: string): never {
    if (isTimeoutError(err) || isNetworkError(err)) {
      throw PaymentException.create('NETWORK_ERROR', err)
    }
    if (isHTTPError(err)) {
      throw PaymentException.custom(`Fleeca API error in ${context}`, 'HTTP_CLIENT_ERROR', err)
    }
    throw PaymentException.create('PROCESSING_ERROR', err)
  }
}
