import * as Sentry from '@sentry/tanstackstart-react'
import { env } from '#/config/env.server'

const dsn = env.NODE_ENV === 'development' ? undefined : env.VITE_SENTRY_DSN

if (dsn) {
  Sentry.init({
    dsn,
    environment: __SENTRY_ENVIRONMENT__,
    release: env.SENTRY_RELEASE || undefined,
    tracesSampleRate: 0,
  })
}
