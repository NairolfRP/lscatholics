import { Exception } from '@adonisjs/core/exceptions'
import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'

export default class PaymentException extends Exception {
  static codes = {
    INVALID_PRICE: 'INVALID_PRICE',
    EMPTY_TOKEN: 'EMPTY_TOKEN',
    TOKEN_GENERATION_ERROR: 'TOKEN_GENERATION_ERROR',
    SESSION_NOT_FOUND: 'SESSION_NOT_FOUND',
    SESSION_EXPIRED: 'SESSION_EXPIRED',
    TOKEN_MISMATCH: 'TOKEN_MISMATCH',
    AMOUNT_MISMATCH: 'AMOUNT_MISMATCH',
    INVALID_AUTH_KEY: 'INVALID_AUTH_KEY',
    PAYMENT_NOT_SUCCESSFUL: 'PAYMENT_NOT_SUCCESSFUL',
    TOKEN_EXPIRED: 'TOKEN_EXPIRED',
    VALIDATION_FAILED: 'VALIDATION_FAILED',
    INVALID_PARAMETERS: 'INVALID_PARAMETERS',
    NETWORK_ERROR: 'NETWORK_ERROR',
    HTTP_CLIENT_ERROR: 'HTTP_CLIENT_ERROR',
    PROCESSING_ERROR: 'PROCESSING_ERROR',
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    EMPTY_RESPONSE: 'EMPTY_RESPONSE',
    URL_GENERATION_ERROR: 'URL_GENERATION_ERROR',
    RETRY_ERROR: 'RETRY_ERROR',
  } as const

  private static statusMapping: Record<string, number> = {
    INVALID_PRICE: 400,
    INVALID_PARAMETERS: 400,
    AMOUNT_MISMATCH: 400,
    SESSION_NOT_FOUND: 404,
    SESSION_EXPIRED: 410,
    TOKEN_EXPIRED: 410,
    INVALID_AUTH_KEY: 401,
    PAYMENT_NOT_SUCCESSFUL: 402,
    TOKEN_MISMATCH: 400,
    VALIDATION_FAILED: 400,
    EMPTY_TOKEN: 500,
    TOKEN_GENERATION_ERROR: 500,
    NETWORK_ERROR: 503,
    HTTP_CLIENT_ERROR: 502,
    PROCESSING_ERROR: 500,
    VALIDATION_ERROR: 500,
    EMPTY_RESPONSE: 500,
    URL_GENERATION_ERROR: 500,
    RETRY_ERROR: 500,
  }

  private static defaultMessages: Record<string, string> = {
    INVALID_PRICE: 'The payment amount must be greater than 0',
    INVALID_PARAMETERS: 'Invalid payment parameters',
    EMPTY_TOKEN: 'The received payment token is empty',
    TOKEN_GENERATION_ERROR: 'Failed to generate the payment token',
    SESSION_NOT_FOUND: 'Payment session not found or has expired',
    SESSION_EXPIRED: 'The payment session has expired',
    TOKEN_MISMATCH: 'The payment token does not match',
    AMOUNT_MISMATCH: 'The payment amount does not match',
    INVALID_AUTH_KEY: 'Invalid authentication key',
    PAYMENT_NOT_SUCCESSFUL: 'The payment was not successful',
    TOKEN_EXPIRED: 'The payment token has expired',
    VALIDATION_FAILED: 'Payment validation failed',
    NETWORK_ERROR: 'Network error while connecting to the payment service',
    HTTP_CLIENT_ERROR: 'Error occurred during the payment request',
    PROCESSING_ERROR: 'Error while processing the payment',
    VALIDATION_ERROR: 'Error while validating the payment token',
    EMPTY_RESPONSE: 'Empty response from the payment service',
    URL_GENERATION_ERROR: 'Failed to generate the payment URL',
    RETRY_ERROR: 'Unexpected error during connection attempts',
  }

  public code: string
  public originalError?: unknown

  constructor(message: string, code: keyof typeof PaymentException.codes, originalError?: unknown) {
    const status = PaymentException.statusMapping[code] || 500
    super(message, { status, code })

    this.code = code
    this.originalError = originalError
  }

  static create(
    code: keyof typeof PaymentException.codes,
    originalError?: unknown
  ): PaymentException {
    const message = PaymentException.defaultMessages[code] || 'Une erreur de paiement est survenue'
    return new PaymentException(message, code, originalError)
  }

  static custom(
    message: string,
    code: keyof typeof PaymentException.codes,
    originalError?: unknown
  ): PaymentException {
    return new PaymentException(message, code, originalError)
  }

  async handle(error: this, ctx: HttpContext) {
    const response: any = {
      error: {
        message: error.message,
        code: error.code,
        status: error.status,
      },
    }

    if (app.inDev && error.originalError) {
      response.error['originalError'] = error.originalError
    }

    return ctx.response.status(error.status).json(response)
  }

  async report(error: this, ctx: HttpContext) {
    if (error.status >= 500) {
      ctx.logger.error(
        {
          err: error.originalError || error,
          code: error.code,
          message: error.message,
        },
        'Payment service error'
      )
    }
  }
}
