import type { Log } from '@sentry/tanstackstart-react'

/**
 * Sentry v11 collects every category by default. These sites handle real form
 * submissions (contact, parishioner, applications), so bodies, cookies, query
 * params and user info stay off and headers keep the default denylist.
 */
const DENIED_KEYS = ['forwarded', '-ip', 'remote-', 'via', '-user']

export const dataCollection = {
  userInfo: false,
  cookies: false,
  httpHeaders: {
    request: { deny: DENIED_KEYS },
    response: { deny: DENIED_KEYS },
  },
  httpBodies: [],
  urlQueryParams: { deny: DENIED_KEYS },
  genAI: { inputs: false, outputs: false },
  databaseQueryData: false,
  graphQL: { document: false, variables: false },
}

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
