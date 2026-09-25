import * as Sentry from '@sentry/tanstackstart-react'
import { env } from '#/config/env.server'
import { beforeSendLog } from '#/config/sentry'

const dsn = env.NODE_ENV === 'development' ? undefined : env.VITE_SENTRY_DSN

if (dsn) {
  Sentry.init({
    dsn,
    environment: __SENTRY_ENVIRONMENT__,
    release: env.SENTRY_RELEASE || undefined,
    enableLogs: true,
    beforeSendLog,
    integrations: [
      Sentry.pinoIntegration({
        log: { levels: ['info', 'warn', 'error'] },
      }),
    ],
    tracesSampleRate: 0,
  })
  Sentry.setAttribute('service', 'lscatholics-web')
}
