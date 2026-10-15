import { createMiddleware, createStart } from '@tanstack/react-start'
import { setResponseHeader } from '@tanstack/react-start/server'
import { cspConfig } from './config/csp.server'
import { securityHeaders } from './config/headers.server'
import { csrfMiddleware } from './middleware/csrf.middleware'
import { sentryFunctionMiddleware, sentryRequestMiddleware } from './middleware/sentry.middleware'

const globalHeadersMiddleware = createMiddleware().server(({ next }) => {
  const [nonce, cspHeader] = cspConfig()

  for (const [name, value] of Object.entries({
    ...securityHeaders,
    'Content-Security-Policy': cspHeader,
  })) {
    setResponseHeader(name, value)
  }

  return next({ context: { nonce } })
})

export const startInstance = createStart(() => {
  return {
    requestMiddleware: [sentryRequestMiddleware, csrfMiddleware, globalHeadersMiddleware],
    functionMiddleware: [sentryFunctionMiddleware],
  }
})
