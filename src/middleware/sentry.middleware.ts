import { isNotFound, isRedirect } from '@tanstack/react-router'
import { createMiddleware } from '@tanstack/react-start'
import * as Sentry from '@sentry/tanstackstart-react'

const REPORTED_MARKER = Symbol('lscatholics.sentry.reported')
const DEDUP_WINDOW_MS = 10_000
const clientDedupCache = new Map<string, number>()

function errorSignature(error: unknown): string {
  if (error instanceof Error) {
    const frame = error.stack?.split('\n')[1]?.trim() ?? ''
    return `${error.name}:${error.message}:${frame}`
  }
  return `non-error:${typeof error}:${String(error)}`
}

function alreadyCapturedRecently(error: unknown): boolean {
  if (typeof document === 'undefined') return false
  const key = errorSignature(error)
  const now = Date.now()
  const last = clientDedupCache.get(key)
  if (last !== undefined && now - last < DEDUP_WINDOW_MS) return true
  clientDedupCache.set(key, now)
  return false
}

function asMarkable(error: unknown): Record<PropertyKey, unknown> | null {
  return typeof error === 'object' && error !== null && !Array.isArray(error)
    ? (error as Record<PropertyKey, unknown>)
    : null
}

export function markReported(error: unknown): unknown {
  const target = asMarkable(error)
  if (target) {
    Object.defineProperty(target, REPORTED_MARKER, {
      value: true,
      configurable: true,
      writable: true,
    })
  }
  return error
}

export function isReported(error: unknown): boolean {
  const target = asMarkable(error)
  return target ? target[REPORTED_MARKER] === true : false
}

/**
 * Returns whether an error is genuinely unexpected and should be reported to
 * Sentry. Framework and app control-flow errors are intentionally skipped.
 */
export function shouldReport(error: unknown): boolean {
  if (isReported(error)) return false
  if (isNotFound(error) || isRedirect(error) || error instanceof Response) return false
  if (!(error instanceof Error)) return true
  if (error.name === 'HttpException') return false
  if (error.message === 'Forbidden' || error.message === 'Unauthorized') return false
  if (error.message === 'Internal error') return false
  return true
}

/**
 * Captures an unexpected error once (idempotent per error instance) with
 * optional context. Marks the error as reported so outer middleware layers
 * don't report the same error again.
 */
export function captureUnexpected(error: unknown, context?: Record<string, unknown>): void {
  if (!Sentry.getClient() || !shouldReport(error) || alreadyCapturedRecently(error)) return
  markReported(error)

  Sentry.withScope((scope) => {
    if (context && Object.keys(context).length > 0) {
      scope.setContext('error_context', context)
    }
    Sentry.captureException(error, {
      mechanism: { type: 'internal', handled: false },
    })
  })
}

export const sentryRequestMiddleware = createMiddleware({ type: 'request' }).server(
  async ({ next, request, handlerType, serverFnMeta }) => {
    try {
      return await next()
    } catch (error) {
      captureUnexpected(error, {
        url: request.url,
        handlerType,
        serverFnName: serverFnMeta?.name,
      })
      throw error
    }
  }
)

export const sentryFunctionMiddleware = createMiddleware({ type: 'function' }).server(
  async ({ next, method, serverFnMeta }) => {
    try {
      return await next()
    } catch (error) {
      captureUnexpected(error, {
        method,
        serverFnName: serverFnMeta.name,
        serverFnFilename: serverFnMeta.filename,
      })
      throw error
    }
  }
)
