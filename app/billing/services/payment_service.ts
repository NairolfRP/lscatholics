import fleecaConfig from '#config/fleeca'
import type {
  FleecaGatewayToken,
  FleecaValidationResponse,
  PaymentResult,
  PaymentSessionData,
} from '#billing/types/payment'
import encryption from '@adonisjs/core/services/encryption'
import hash from '@adonisjs/core/services/hash'
import logger from '@adonisjs/core/services/logger'
import PaymentException from '#billing/exceptions/payment_exception'
import app from '@adonisjs/core/services/app'
import type { HeadersInit } from '#shared/types/utils.types'
import type { HttpContext } from '@adonisjs/core/http'
import ky, { isHTTPError, isNetworkError, isTimeoutError } from 'ky'

export class PaymentService {
  /**
   * Generate Fleeca payment URL with encrypted session data
   */
  async generatePaymentUrl(
    source: string,
    amount: number,
    metadata: Record<string, any> = {},
    session: HttpContext['session']
  ): Promise<{ paymentUrl: string; sessionId: string }> {
    this.#validatePaymentParameters(amount, source)

    const [gatewayToken, sessionId] = await Promise.all([
      this.#generateGatewayToken({ price: amount }),
      hash.make(`${source}_${amount}_${Date.now()}_${Math.random()}`),
    ])

    const sessionData: PaymentSessionData = {
      sessionId,
      token: gatewayToken,
      source,
      amount,
      metadata,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + fleecaConfig.sessionTTL * 1000),
    }

    this.#storeSessionData(session, sessionData)

    return {
      paymentUrl: this.#buildGatewayUrl(gatewayToken),
      sessionId,
    }
  }

  /**
   * Process payment callback
   */
  async processPaymentCallback(
    token: string,
    session: HttpContext['session']
  ): Promise<PaymentResult<FleecaValidationResponse>> {
    try {
      const sessionData = await this.#getSessionData(session)

      if (!sessionData) {
        throw PaymentException.create('SESSION_NOT_FOUND')
      }

      if (new Date() > sessionData.expiresAt) {
        this.cancelPayment(session)
        throw PaymentException.create('SESSION_EXPIRED')
      }

      const validationResponse = await this.#validateToken(token)

      await this.#validatePaymentDetails(validationResponse, sessionData)

      this.cancelPayment(session)

      return {
        success: true,
        sessionData,
        transactionData: validationResponse,
      }
    } catch (err) {
      logger.error({ err }, 'Payment callback processing error')
      this.cancelPayment(session)

      if (err instanceof PaymentException) {
        throw err
      }

      throw PaymentException.create('PROCESSING_ERROR', err)
    }
  }

  cancelPayment(session: HttpContext['session']): void {
    session.forget('payment_data')
  }

  #getBaseUrl(): string {
    return fleecaConfig.server === 'fr' ? 'https://fleeca.gta.world' : 'https://banking.gta.world'
  }

  #getHeaders({ includeAuth = true }: { includeAuth?: boolean }): HeadersInit {
    const headers: HeadersInit = {
      Accept: 'application/json',
    }

    if (includeAuth && fleecaConfig.authKey) {
      headers['Authorization'] = `Bearer ${fleecaConfig.authKey}`
    }

    return headers
  }

  /**
   * Generate Fleeca Gateway Token
   */
  async #generateGatewayToken({
    price,
    type = 0,
  }: {
    price: number
    type?: number
  }): Promise<FleecaGatewayToken> {
    if (price <= 0) {
      throw PaymentException.create('INVALID_PRICE')
    }

    try {
      const url = `${this.#getBaseUrl()}/gateway_token/generateToken?price=${price}&type=${type}`

      const token = (await ky
        .get(url, {
          retry: {
            limit: 3,
          },
          headers: this.#getHeaders({ includeAuth: true }),
        })
        .text()) as FleecaGatewayToken

      if (!token?.trim()) {
        throw PaymentException.create('EMPTY_TOKEN')
      }

      return token
    } catch (err) {
      logger.error({ err, price, type }, 'Failed to generate Gateway Token')

      if (isTimeoutError(err) || isNetworkError(err)) {
        throw PaymentException.create('NETWORK_ERROR', err)
      }

      if (isHTTPError(err)) {
        throw PaymentException.create('TOKEN_GENERATION_ERROR', err)
      }

      throw err
    }
  }

  #storeSessionData(session: HttpContext['session'], sessionData: PaymentSessionData): void {
    const serializable = {
      ...sessionData,
      createdAt: sessionData.createdAt.toISOString(),
      expiresAt: sessionData.expiresAt.toISOString(),
    }

    const encryptedData = encryption.encrypt(JSON.stringify(serializable))
    session.put('payment_data', encryptedData)
  }

  async #getSessionData(session: HttpContext['session']): Promise<PaymentSessionData | null> {
    const encryptedData = session.get('payment_data')

    if (!encryptedData) {
      return null
    }

    try {
      const decrypted = encryption.decrypt(encryptedData) as string
      const parsed = JSON.parse(decrypted)
      return {
        ...parsed,
        createdAt: new Date(parsed.createdAt),
        expiresAt: new Date(parsed.expiresAt),
      }
    } catch (error) {
      logger.error({ err: error }, 'Failed to decrypt session data')
      this.cancelPayment(session)
      return null
    }
  }

  /**
   * Validate token with Fleeca API
   */
  async #validateToken(token: string): Promise<FleecaValidationResponse> {
    try {
      const url = `${this.#getBaseUrl()}/gateway_token/${token}`

      const response = await ky.post(url, {
        timeout: fleecaConfig.timeout,
        retry: {
          methods: ['post'],
          limit: 3,
        },
        headers: {
          Accept: 'application/json',
        },
      })

      const data = await response.json<FleecaValidationResponse>()

      if (!data) {
        throw PaymentException.create('EMPTY_RESPONSE')
      }

      return data
    } catch (err) {
      logger.error({ err, token }, 'Token validation failed')

      if (isTimeoutError(err) || isNetworkError(err)) {
        throw PaymentException.create('NETWORK_ERROR', err)
      }

      throw err instanceof PaymentException ? err : PaymentException.create('VALIDATION_ERROR', err)
    }
  }

  /**
   * Validate payment details against session
   */
  async #validatePaymentDetails(
    validationResponse: FleecaValidationResponse,
    sessionData: PaymentSessionData
  ): Promise<void> {
    if (app.inProduction && validationResponse.sandbox) {
      throw PaymentException.custom(
        'Sandbox token not allowed in production',
        'PAYMENT_NOT_SUCCESSFUL'
      )
    }

    if (validationResponse.payment !== sessionData.amount) {
      throw PaymentException.custom(
        `Amount mismatch: expected ${sessionData.amount}, got ${validationResponse.payment}`,
        'AMOUNT_MISMATCH'
      )
    }

    if (validationResponse.auth_key !== fleecaConfig.authKey) {
      throw PaymentException.create('INVALID_AUTH_KEY')
    }

    if (validationResponse.message !== 'payment_successful') {
      throw PaymentException.custom(
        `Payment not successful: ${validationResponse.message}`,
        'PAYMENT_NOT_SUCCESSFUL'
      )
    }

    if (validationResponse.token_expired) {
      throw PaymentException.create('TOKEN_EXPIRED')
    }
  }

  /**
   * Build Fleeca gateway URL
   */
  #buildGatewayUrl(token: string): string {
    return `${this.#getBaseUrl()}/gateway/${token}`
  }

  /**
   * Validate payment parameters
   */
  #validatePaymentParameters(amount: number, source: string): void {
    if (!fleecaConfig.authKey) {
      throw PaymentException.create('INVALID_PARAMETERS')
    }

    if (!amount || amount <= 0) {
      throw PaymentException.create('INVALID_PRICE')
    }

    if (!source?.trim()) {
      throw PaymentException.custom('Payment source is required', 'INVALID_PARAMETERS')
    }
  }
}
