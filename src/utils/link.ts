export function isExternalLink(href: string) {
  const EXTERNAL_RE = /^(https?:\/\/|www\.)/i

  return EXTERNAL_RE.test(href)
}

export function toInternalPath(href: string): string | null {
  if (href.startsWith('#')) return href

  if (href.startsWith('/') && !href.startsWith('//')) return href

  try {
    const url = new URL(href)
    const appOrigin = new URL(import.meta.env.VITE_APP_URL).origin
    if (url.origin === appOrigin) {
      return url.pathname + url.search + url.hash
    }
  } catch {}

  return null
}
