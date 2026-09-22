import { isNotFound, isRedirect } from '@tanstack/react-router'
import { setResponseStatus } from '@tanstack/react-start/server'
import { captureUnexpected, markReported } from '#/middleware/sentry.middleware'
import { HttpException } from '#server/exceptions/http-exception.ts'
import { logger } from '#server/integrations/logger.ts'

/**
 * Handles an unexpected service error: logs it server-side and throws a generic
 * error so internal details (e.g. SQL) never reach the client. Framework and
 * HTTP control-flow errors are rethrown untouched.
 */
export function handleServiceError(
  err: unknown,
  context: Record<string, unknown>,
  message: string
): never {
  if (
    isNotFound(err) ||
    isRedirect(err) ||
    err instanceof HttpException ||
    err instanceof Response
  ) {
    throw err
  }

  logger.error({ err, ...context }, message)
  captureUnexpected(err, context)
  setResponseStatus(500)
  throw markReported(new Error('Internal error'))
}
