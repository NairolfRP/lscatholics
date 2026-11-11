import { createMiddleware } from '@tanstack/react-start'
import { setResponseHeader } from '@tanstack/react-start/server'

const DEV = import.meta.env.DEV
const devOnly = (...values: string[]) => (DEV ? values : [])

const buildCsp = (nonce: string) =>
  Object.entries({
    'default-src': ["'self'"],
    'script-src': [
      "'self'",
      `'nonce-${nonce}'`,
      'https://va.vercel-scripts.com',
      ...devOnly("'unsafe-eval'", 'https://cdn.jsdelivr.net'),
    ],
    'style-src': ["'self'", `'unsafe-inline'`, 'https://fonts.bunny.net'],
    'img-src': ["'self'", 'data:', 'https:'],
    'font-src': [
      "'self'",
      'https://fonts.bunny.net',
      'https://cdn.jsdelivr.net',
      ...devOnly('https://fonts.scalar.com'),
    ],
    'connect-src': [
      "'self'",
      'https://ucp-fr.gta.world',
      'https://api.aelf.org',
      'https://vitals.vercel-insights.com',
      ...devOnly('https://cdn.jsdelivr.net', 'https://api.scalar.com'),
    ],
    'frame-src': ["'none'"],
    'object-src': [`'none'`],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
    'frame-ancestors': ['nui:', 'https://cfx-nui-client'],
  })
    .map(([directive, values]) => `${directive} ${values.join(' ')}`)
    .join('; ')

export const cspMiddleware = createMiddleware().server(({ next }) => {
  const nonce = btoa(crypto.randomUUID())
  setResponseHeader('Content-Security-Policy', buildCsp(nonce))
  return next({ context: { nonce } })
})
