import fleecaConfig from '#config/fleeca'
import {
  FleecaGatewayToken,
  FleecaValidationResponse,
  PaymentResult,
  PaymentSessionData,
} from '#core/types/payment'
import encryption from '@adonisjs/core/services/encryption'
import hash from '@adonisjs/core/services/hash'
import logger from '@adonisjs/core/services/logger'

export class PaymentService {
  private getBaseUrl(): string {
    return fleecaConfig.server === 'fr' ? 'https://fleeca.gta.world' : 'https://banking.gta.world'
  }

  /**
   * Generate Fleeca Gateway Token
   */
  private async generateGatewayToken({ price, type = 0 }: { price: number; type?: number }) {
    if (price <= 0) {
      throw new Error('Price number must be greater than 0.')
    }

    try {
      const apiKey = fleecaConfig.authKey
      const generateGatewayTokenUrl = `${this.getBaseUrl()}/gateway_token/generateToken?price=${price}&type=${type}`

      const response = await fetch(generateGatewayTokenUrl, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
      })

      if (!response.ok) {
        throw new Error(`Gateway token request failed with status ${response.status}`)
      }

      return (await response.text()) as FleecaGatewayToken
    } catch (error) {
      throw error
    }
  }

  /**
   * Generate Fleeca payment URL with encrypted session data
   */
  async generatePaymentUrl(
    source: string,
    amount: number,
    metadata: Record<string, any> = {},
    session: any
  ): Promise<{ paymentUrl: string; sessionId: string }> {
    try {
      this.validatePaymentParameters(amount, source)

      const gatewayToken = await this.generateGatewayToken({ price: amount })

      if (!gatewayToken) {
        throw new Error('Failed to generate gateway token.')
      }

      const sessionId = await hash.make(`${source}_${amount}_${Date.now()}_${Math.random()}`)

      const sessionData: PaymentSessionData = {
        sessionId,
        token: gatewayToken,
        source,
        amount,
        metadata,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + fleecaConfig.sessionTTL * 1000),
      }

      const encryptedData = encryption.encrypt(JSON.stringify(sessionData))
      session.put('payment_data', encryptedData)

      const paymentUrl = this.buildGatewayUrl(gatewayToken)

      return {
        paymentUrl,
        sessionId,
      }
    } catch (error) {
      logger.error({ err: error }, 'Error generating payment URL')
      throw new Error('Failed to generate payment URL')
    }
  }

  /**
   * Process payment callback
   */
  async processPaymentCallback(
    token: string,
    session: any
  ): Promise<PaymentResult<FleecaValidationResponse>> {
    try {
      const encryptedData = session.get('payment_data')
      if (!encryptedData) {
        throw new Error('No payment session found')
      }

      const sessionData: PaymentSessionData = JSON.parse(
        encryption.decrypt(encryptedData) as string
      )

      if (new Date() > sessionData.expiresAt) {
        session.forget('payment_data')
        throw new Error('Payment session expired')
      }

      const validationResponse = await this.validateToken(token)

      this.validatePaymentDetails(validationResponse, sessionData)

      session.forget('payment_data')

      return {
        success: true,
        sessionData,
        transactionData: validationResponse,
      }
    } catch (error) {
      logger.error({ err: error }, 'Payment callback processing error')
      session.forget('payment_data')

      return {
        success: false,
        sessionData: {
          token: '',
          sessionId: '',
          source: 'unknown',
          amount: 0,
          metadata: {},
          createdAt: new Date(),
          expiresAt: new Date(),
        },
      }
    }
  }

  /**
   * Validate token with Fleeca API
   */
  private async validateToken(token: string): Promise<FleecaValidationResponse> {
    try {
      const tokenValidationUrl = `${this.getBaseUrl()}/gateway_token/${token}/strict`

      const response = await fetch(tokenValidationUrl, {
        method: 'GET',
        body: JSON.stringify({ token }),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`Validation request failed with status ${response.status}`)
      }

      return (await response.json()) as FleecaValidationResponse
    } catch (error) {
      throw error
    }
  }

  /**
   * Validate payment details against session
   */
  private validatePaymentDetails(
    validationResponse: FleecaValidationResponse,
    sessionData: PaymentSessionData
  ): void {
    if (validationResponse.payment !== sessionData.amount) {
      throw new Error(
        `Payment amount mismatch: expected ${sessionData.amount}, got ${validationResponse.payment}`
      )
    }

    if (validationResponse.auth_key !== fleecaConfig.authKey) {
      throw new Error('Invalid auth key in payment response')
    }

    if (validationResponse.message !== 'payment_successful') {
      throw new Error(`Payment was not successful: ${validationResponse.message}`)
    }

    if (validationResponse.token_expired) {
      throw new Error('Payment token is expired')
    }
  }

  /**
   * Build Fleeca gateway URL
   */
  private buildGatewayUrl(token: string): string {
    return `${this.getBaseUrl()}/gateway/${token}`
  }

  /**
   * Validate payment parameters
   */
  private validatePaymentParameters(amount: number, source: string): void {
    if (!amount || amount <= 0) {
      throw new Error('Payment amount must be greater than 0')
    }

    if (!source || source.trim().length === 0) {
      throw new Error('Payment source is required')
    }

    if (!fleecaConfig.authKey) {
      throw new Error('Fleeca auth key is not configured')
    }
  }
}
