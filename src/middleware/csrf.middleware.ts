import { createCsrfMiddleware } from '@tanstack/react-start'

const CFX_NUI_ORIGIN = 'https://cfx-nui-client'

export const csrfMiddleware = createCsrfMiddleware({
  filter: (ctx) => ctx.handlerType === 'serverFn',
  secFetchSite: (secFetchSite, ctx) => {
    if (ctx.request.headers.get('Origin')?.startsWith(CFX_NUI_ORIGIN)) return true
    return secFetchSite === 'same-origin'
  },
  origin: (origin, ctx) =>
    origin.startsWith(CFX_NUI_ORIGIN) || origin === new URL(ctx.request.url).origin,
})
