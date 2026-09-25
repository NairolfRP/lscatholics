import type { Log } from '@sentry/tanstackstart-react'

const SENSITIVE_LOG_ATTRIBUTES = new Set([
  'password',
  'confirmpassword',
  'authorization',
  'cookie',
  'setcookie',
  'token',
  'accesstoken',
  'refreshtoken',
  'apikey',
  'apitoken',
  'secret',
  'clientsecret',
  'webhookurl',
  'creditcard',
  'cardnumber',
  'cvv',
  'cvc',
  'rawbody',
  'body',
  'payload',
  'data',
  'metadata',
])

function isSensitiveLogAttribute(key: string): boolean {
  const normalizedKey = key.toLowerCase().replace(/[^a-z0-9]/g, '')
  return SENSITIVE_LOG_ATTRIBUTES.has(normalizedKey)
}

export function beforeSendLog(log: Log): Log {
  if (!log.attributes) return log

  return {
    ...log,
    attributes: Object.fromEntries(
      Object.entries(log.attributes).filter(([key]) => !isSensitiveLogAttribute(key))
    ),
  }
}
