import { createMiddleware } from '@tanstack/react-start'
import { setPrivateNoStore } from '#server/lib/http-cache'

const PRIVATE_PREFIXES = ['/dashboard', '/account', '/api', '/sign-in']

const STATIC_EXT = /\.(?:js|css|png|jpe?g|webp|avif|svg|ico|woff2?|ttf|otf|map|txt|xml)$/i

export const cachePolicyMiddleware = createMiddleware().server(({ next, request }) => {
  const url = new URL(request.url)
  const pathname = url.pathname

  // Never touch static assets.
  if (STATIC_EXT.test(pathname)) return next()

  const isPrivate = PRIVATE_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))

  if (isPrivate) {
    setPrivateNoStore()
  }

  return next()
})
