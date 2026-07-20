import crypto from 'node:crypto'
import { inDev } from '#/server/services/app.service'

const csp = (nonce: string) => ({
  'default-src': ["'self'"],
  'script-src': inDev ? ["'self'", "'unsafe-eval'"] : ["'self'", 'https://va.vercel-scripts.com'],
  'script-src-elem': [
    "'self'",
    `'nonce-${nonce}'`,
    'https://va.vercel-scripts.com',
    ...(import.meta.env.DEV ? ['https://cdn.jsdelivr.net'] : []),
  ],
  'style-src': ["'self'", `'unsafe-inline'`, 'https://fonts.bunny.net'],
  'img-src': ["'self'", 'data:', 'https:'],
  'font-src': [
    "'self'",
    'https://fonts.bunny.net',
    ...(import.meta.env.DEV ? ['https://fonts.scalar.com'] : []),
  ],
  'connect-src': [
    "'self'",
    'https://ucp-fr.gta.world',
    'https://api.aelf.org',
    'https://vitals.vercel-insights.com',
    ...(import.meta.env.DEV ? ['https://cdn.jsdelivr.net', 'https://api.scalar.com'] : []),
  ],
  'frame-src': ["'none'"],
  'object-src': [`'none'`],
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
  'frame-ancestors': ["'none'"],
})

export function cspConfig() {
  const nonce = crypto.randomBytes(16).toString('base64')

  return [
    nonce,
    Object.entries(csp(nonce))
      .map(([directive, values]) => `${directive} ${values.join(' ')}`)
      .join('; '),
  ]
}
