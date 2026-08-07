import { setResponseStatus } from '@tanstack/react-start/server'

/**
 * Generic HTTP eception to be thrown from a server function or API Route
 *
 * @example throw new HttpException(404, ‘User not found’)
 */
export class HttpException extends Error {
  readonly status: number
  readonly details?: unknown

  constructor(status: number, message: string, details?: unknown) {
    super(message)
    this.name = 'HttpException'
    this.status = status
    this.details = details

    Object.setPrototypeOf(this, HttpException.prototype)

    setResponseStatus(this.status)
  }

  /** Converts the exception into a Response */
  toResponse(): Response {
    return new Response(
      JSON.stringify({
        error: this.message,
        status: this.status,
        details: this.details,
      }),
      {
        status: this.status,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}

export const UnauthorizedException = (message = 'Unauthorized', details?: unknown) =>
  new HttpException(401, message, details)

export const NotFoundException = (message = 'Not found', details?: unknown) =>
  new HttpException(404, message, details)
