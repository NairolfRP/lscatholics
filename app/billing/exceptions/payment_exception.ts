import { Exception } from '@adonisjs/core/exceptions'
import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'

export default class PaymentException extends Exception {
  static codes = {
    INVALID_PRICE: 'INVALID_PRICE',
    INVALID_PARAMETERS: 'INVALID_PARAMETERS',

    INVALID_AUTH_KEY: 'INVALID_AUTH_KEY',
    WEBHOOK_SIGNATURE_INVALID: 'WEBHOOK_SIGNATURE_INVALID',
    WEBHOOK_AMOUNT_MISMATCH: 'WEBHOOK_AMOUNT_MISMATCH',
    WEBHOOK_MODE_MISMATCH: 'WEBHOOK_MODE_MISMATCH',

    PAYMENT_NOT_FOUND: 'PAYMENT_NOT_FOUND',
    PAYMENT_NOT_SUCCESSFUL: 'PAYMENT_NOT_SUCCESSFUL',

    NETWORK_ERROR: 'NETWORK_ERROR',
    HTTP_CLIENT_ERROR: 'HTTP_CLIENT_ERROR',
    EMPTY_RESPONSE: 'EMPTY_RESPONSE',

    PROCESSING_ERROR: 'PROCESSING_ERROR',
    VALIDATION_ERROR: 'VALIDATION_ERROR',
  } as const

  private static statusMapping: Record<string, number> = {
    INVALID_PRICE: 400,
    INVALID_PARAMETERS: 400,
    INVALID_AUTH_KEY: 401,
    WEBHOOK_SIGNATURE_INVALID: 403,
    WEBHOOK_AMOUNT_MISMATCH: 400,
    WEBHOOK_MODE_MISMATCH: 400,
    PAYMENT_NOT_FOUND: 404,
    PAYMENT_NOT_SUCCESSFUL: 402,
    NETWORK_ERROR: 503,
    HTTP_CLIENT_ERROR: 502,
    EMPTY_RESPONSE: 500,
    PROCESSING_ERROR: 500,
    VALIDATION_ERROR: 500,
  }

  private static defaultMessages: Record<string, string> = {
    INVALID_PRICE: 'The payment amount must be greater than 0',
    INVALID_PARAMETERS: 'Invalid payment parameters',
    INVALID_AUTH_KEY: 'Invalid authentication key',
    WEBHOOK_SIGNATURE_INVALID: 'Webhook signature verification failed',
    WEBHOOK_AMOUNT_MISMATCH: 'Webhook amount does not match the initiated payment',
    WEBHOOK_MODE_MISMATCH: 'Webhook mode does not match the expected payment mode',
    PAYMENT_NOT_FOUND: 'Payment not found',
    PAYMENT_NOT_SUCCESSFUL: 'The payment was not successful',
    NETWORK_ERROR: 'Network error while connecting to the payment service',
    HTTP_CLIENT_ERROR: 'Error occurred during the payment request',
    EMPTY_RESPONSE: 'Empty response from the payment service',
    PROCESSING_ERROR: 'Error while processing the payment',
    VALIDATION_ERROR: 'Error while validating the payment data',
  }

  public code: string
  public originalError?: unknown

  constructor(message: string, code: keyof typeof PaymentException.codes, originalError?: unknown) {
    const status = PaymentException.statusMapping[code] ?? 500
    super(message, { status, code })
    this.code = code
    this.originalError = originalError
  }

  static create(
    code: keyof typeof PaymentException.codes,
    originalError?: unknown
  ): PaymentException {
    const message = PaymentException.defaultMessages[code] ?? 'An unexpected payment error occurred'
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
    const body: Record<string, unknown> = {
      error: {
        message: error.message,
        code: error.code,
        status: error.status,
      },
    }

    if (app.inDev && error.originalError) {
      body.error = { ...(body.error as object), originalError: error.originalError }
    }

    return ctx.response.status(error.status).json(body)
  }

  async report(error: this, ctx: HttpContext) {
    if (error.status >= 500) {
      ctx.logger.error(
        { err: error.originalError ?? error, code: error.code, message: error.message },
        'Payment service error'
      )
    }
  }
}
