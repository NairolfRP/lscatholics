import * as Sentry from '@sentry/tanstackstart-react'

const sentryDsn = import.meta.env?.VITE_SENTRY_DSN ?? process.env.VITE_SENTRY_DSN
const isProduction = import.meta.env?.PROD ?? process.env.NODE_ENV === 'production'
const isTest = process.env.NODE_ENV === 'test'

if (!sentryDsn) {
  console.warn('VITE_SENTRY_DSN is not defined. Sentry is not running.')
} else {
  Sentry.init({
    dsn: sentryDsn,
    enabled: isProduction,
    enableLogs: isProduction,
    integrations: [
      Sentry.pinoIntegration({ error: { levels: ['warn', 'error'] } }),
      Sentry.zodErrorsIntegration(),
    ],
    environment: isProduction ? 'production' : isTest ? 'test' : 'development',
    // Adds request headers and IP for users, for more info visit:
    // https://docs.sentry.io/platforms/javascript/guides/tanstackstart-react/configuration/options/#sendDefaultPii
    sendDefaultPii: true,
    tracesSampleRate: 0.1,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
  })
}
