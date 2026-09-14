import { describe, expect, it } from 'vitest'
import { applyCookiePolicy, isCEFHeaders } from '#/utils/fivem'

const CEF_USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.5060.141 CitizenFX/1.0.0.36109 Safari/537.36'

function cefRequest(url = 'https://lscatholics.vercel.app/api/auth'): Request {
  return new Request(url, {
    headers: { 'user-agent': CEF_USER_AGENT },
  })
}

describe('isCEFHeaders', () => {
  it('detects a request from the FiveM NUI browser from the user-agent alone', () => {
    const headers = new Headers({
      'user-agent': CEF_USER_AGENT,
      'referer': 'https://lscatholics.vercel.app/',
    })

    expect(isCEFHeaders(headers)).toBe(true)
  })

  it('detects a CEF request even without origin or referer headers', () => {
    expect(isCEFHeaders(new Headers({ 'user-agent': CEF_USER_AGENT }))).toBe(true)
  })

  it('rejects regular web browser requests', () => {
    const headers = new Headers({
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0) Chrome/120.0',
      'referer': 'https://example.com',
    })

    expect(isCEFHeaders(headers)).toBe(false)
  })

  it('rejects requests without a user-agent', () => {
    expect(isCEFHeaders(new Headers())).toBe(false)
  })
})

describe('applyCookiePolicy', () => {
  it('rewrites SameSite to None and adds Secure for CEF requests', async () => {
    const request = cefRequest()
    const response = new Response('{"ok":true}', {
      status: 200,
      headers: {
        'content-type': 'application/json',
        'set-cookie':
          'lscatholics.session_token=abc; Max-Age=604800; Path=/; HttpOnly; SameSite=Lax',
      },
    })

    const result = applyCookiePolicy(request, response)

    expect(result.status).toBe(200)
    expect(await result.text()).toBe('{"ok":true}')
    const setCookie = result.headers.get('set-cookie')
    expect(setCookie).toContain('SameSite=None')
    expect(setCookie).toContain('Secure')
    expect(setCookie).not.toContain('SameSite=Lax')
  })

  it('rewrites every set-cookie header', () => {
    const request = cefRequest()
    const headers = new Headers({ location: '/' })
    headers.append('set-cookie', 'lscatholics.session_token=abc; HttpOnly; SameSite=Lax')
    headers.append('set-cookie', 'lscatholics.oauth_state=xyz; HttpOnly; Secure; SameSite=Lax')
    const response = new Response(null, { status: 302, headers })

    const result = applyCookiePolicy(request, response)

    const setCookies =
      typeof result.headers.getSetCookie === 'function' ? result.headers.getSetCookie() : []
    expect(setCookies).toHaveLength(2)
    for (const cookie of setCookies) expect(cookie).toContain('SameSite=None')
  })

  it('returns the response unchanged for regular web requests', () => {
    const request = new Request('https://example.com/api/auth', {
      headers: { 'user-agent': 'Mozilla/5.0 Chrome/120.0' },
    })
    const response = new Response('ok', {
      headers: {
        'set-cookie': 'lscatholics.session_token=abc; HttpOnly; Secure; SameSite=Lax',
      },
    })

    expect(applyCookiePolicy(request, response)).toBe(response)
  })

  it('returns the response unchanged for CEF when cookies already have None + Secure', () => {
    const request = cefRequest()
    const response = new Response('ok', {
      headers: {
        'set-cookie': 'lscatholics.session_token=abc; HttpOnly; Secure; SameSite=None',
      },
    })

    expect(applyCookiePolicy(request, response)).toBe(response)
  })

  it('returns the response unchanged when there is no set-cookie header', () => {
    const response = new Response('ok')

    expect(applyCookiePolicy(cefRequest(), response)).toBe(response)
  })
})
