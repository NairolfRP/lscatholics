import * as Sentry from '@sentry/tanstackstart-react'

const sentryDSN = import.meta.env.VITE_SENTRY_DSN

if (!sentryDSN) {
  console.warn('VITE_SENTRY_DSN is not defined. Sentry is not running.')
} else {
  Sentry.init({
    enabled: import.meta.env.PROD,
    dsn: sentryDSN,
    enableLogs: true,
    tracesSampleRate: 0.1,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    tracePropagationTargets: [/^https:\/\/.*\.vercel\.app/],
  })
}
