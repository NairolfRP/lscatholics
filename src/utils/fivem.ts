import { getRequest } from '@tanstack/react-start/server'

const CEF_USER_AGENT_MARKER = 'CitizenFX'

export function isCEFHeaders(headers: Headers): boolean {
  const userAgent = headers.get('user-agent') || ''
  return userAgent.includes(CEF_USER_AGENT_MARKER)
}

export function isCEFRequest(): boolean {
  try {
    const request = getRequest()
    // oxlint-disable-next-line typescript/no-unnecessary-condition
    if (!request) return false
    return isCEFHeaders(request.headers)
  } catch {
    return false
  }
}

function getSetCookieValues(headers: Headers): string[] {
  if (typeof headers.getSetCookie === 'function') return headers.getSetCookie()
  const value = headers.get('set-cookie')
  return value ? [value] : []
}

function rewriteCookieSameSite(cookie: string, target: 'Lax' | 'None'): string {
  const rewritten = cookie.replace(/\s*;\s*SameSite=[^;]*/i, '')
  const secured =
    target === 'None' && !/;\s*Secure/i.test(rewritten) ? `${rewritten}; Secure` : rewritten
  return `${secured}; SameSite=${target}`
}

function isNoneSecure(cookie: string): boolean {
  return /;\s*SameSite=None/i.test(cookie) && /;\s*Secure/i.test(cookie)
}

export function applyCookiePolicy(request: Request, response: Response): Response {
  if (!isCEFHeaders(request.headers)) return response

  const setCookies = getSetCookieValues(response.headers)
  if (setCookies.length === 0) return response

  if (setCookies.every(isNoneSecure)) return response

  const headers = new Headers(response.headers)
  headers.delete('set-cookie')
  for (const cookie of setCookies) {
    headers.append(
      'set-cookie',
      isNoneSecure(cookie) ? cookie : rewriteCookieSameSite(cookie, 'None')
    )
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  })
}
