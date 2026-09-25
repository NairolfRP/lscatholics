import * as Sentry from '@sentry/tanstackstart-react'
import { envClient } from '#/config/env-client'
import { beforeSendLog } from '#/config/sentry'

const dsn = import.meta.env.DEV ? undefined : envClient.VITE_SENTRY_DSN

if (dsn) {
  Sentry.init({
    dsn,
    environment: __SENTRY_ENVIRONMENT__,
    enableLogs: true,
    beforeSendLog,
    tracesSampleRate: 0,
  })
  Sentry.setAttribute('service', 'lscatholics-web')
}
