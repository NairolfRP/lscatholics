import { createFileRoute } from '@tanstack/react-router'
import { envClient } from '#/config/env-client'

export const Route = createFileRoute('/robots.txt')({
  server: {
    handlers: {
      GET: () => {
        const baseUrl = envClient.VITE_APP_URL.replace(/\/+$/, '')

        const body = `# https://www.robotstxt.org/robotstxt.html
User-agent: *
Allow: /
Disallow: /dashboard/

Sitemap: ${baseUrl}/sitemap.xml
`

        return new Response(body, {
          headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'Cache-Control': 'public, max-age=3600',
          },
        })
      },
    },
  },
})
