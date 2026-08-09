import { createMiddleware, createStart } from '@tanstack/react-start'
import { getResponseHeaders, setResponseHeaders } from '@tanstack/react-start/server'
import {
  sentryGlobalFunctionMiddleware,
  sentryGlobalRequestMiddleware,
} from '@sentry/tanstackstart-react'
import { isProd } from '#/utils/environment.ts'
import { cspConfig } from './config/csp.server'
import { securityHeaders } from './config/headers.server'
import { csrfMiddleware } from './middleware/csrf.middleware'

const globalHeadersMiddleware = createMiddleware().server(({ next }) => {
  const [nonce, cspHeader] = cspConfig()

  const headers = getResponseHeaders()

  for (const [name, value] of Object.entries({
    ...securityHeaders,
    'Content-Security-Policy': cspHeader,
  })) {
    headers.set(name, value)
  }

  setResponseHeaders(headers)
  return next({ context: { nonce } })
})

export const startInstance = createStart(() => {
  return {
    requestMiddleware: [
      ...(isProd ? [sentryGlobalRequestMiddleware] : []),
      csrfMiddleware,
      globalHeadersMiddleware,
    ],
    functionMiddleware: isProd ? [sentryGlobalFunctionMiddleware] : undefined,
  }
})
