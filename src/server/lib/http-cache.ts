import { setResponseHeader } from '@tanstack/react-start/server'

export interface PublicCacheOptions {
  /** Browser cache max-age in seconds. */
  maxAge: number
  /** CDN/shared cache max-age in seconds (s-maxage). */
  sMaxAge: number
  /** stale-while-revalidate window in seconds. */
  staleWhileRevalidate: number
}

/**
 * Applies a public, shared cache policy to the current response.
 * Safe only for responses that do not depend on the visitor's identity.
 */
export function setPublicCache(options: PublicCacheOptions): void {
  const { maxAge, sMaxAge, staleWhileRevalidate } = options
  const parts = [
    'public',
    `max-age=${maxAge}`,
    `s-maxage=${sMaxAge}`,
    `stale-while-revalidate=${staleWhileRevalidate}`,
  ]
  setResponseHeader('Cache-Control', parts.join(', '))
  setResponseHeader('Vary', 'Accept-Encoding')
}

/**
 * Applies a strict no-store policy for private/personalised responses.
 */
export function setPrivateNoStore(): void {
  setResponseHeader('Cache-Control', 'private, no-store, no-cache, must-revalidate')
  setResponseHeader('Pragma', 'no-cache')
  setResponseHeader('Expires', '0')
}
