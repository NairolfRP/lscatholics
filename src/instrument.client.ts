import * as Sentry from '@sentry/tanstackstart-react'
import { envClient } from '#/config/env-client'
import { beforeSendLog, dataCollection } from '#/config/sentry'

const dsn = import.meta.env.PROD ? envClient.VITE_SENTRY_DSN : undefined

if (dsn) {
  Sentry.init({
    dsn,
    environment: __SENTRY_ENVIRONMENT__,
    dataCollection,
    beforeSendLog,
    tracesSampleRate: 0,
  })
  Sentry.setAttribute('service', 'lscatholics-web')
}
