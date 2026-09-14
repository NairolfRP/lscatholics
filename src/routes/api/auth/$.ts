import { createFileRoute } from '@tanstack/react-router'
import { auth } from '#/server/integrations/auth.server'
import { applyCookiePolicy } from '#/utils/fivem'

export const Route = createFileRoute('/api/auth/$')({
  server: {
    handlers: {
      GET: async ({ request }) => applyCookiePolicy(request, await auth.handler(request)),
      POST: async ({ request }) => applyCookiePolicy(request, await auth.handler(request)),
    },
  },
})
