import { createStart } from '@tanstack/react-start'
import { cspMiddleware } from '#/middleware/csp.middleware'
import { csrfMiddleware } from '#/middleware/csrf.middleware'
import { sentryFunctionMiddleware, sentryRequestMiddleware } from '#/middleware/sentry.middleware'

export const startInstance = createStart(() => ({
  requestMiddleware: [sentryRequestMiddleware, csrfMiddleware, cspMiddleware],
  functionMiddleware: [sentryFunctionMiddleware],
}))
