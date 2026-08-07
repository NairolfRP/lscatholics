import { createFileRoute } from '@tanstack/react-router'
import { departments } from '#/config/departments.ts'
import { envClient } from '#/config/env-client'
import { services } from '#/config/services.ts'
import { programs } from '#/features/catholic-charities/constants/programs.constants'
import { logger } from '#server/integrations/logger.ts'
import { churchEventRepository } from '#server/repositories/church-event.repository.ts'
import { jobPostingRepository } from '#server/repositories/job-posting.repository.ts'
import { postRepository } from '#server/repositories/post.repository.ts'

const SITEMAP_ENTRIES_LIMIT = 1000

const STATIC_ROUTES = [
  '',
  '/newsroom',
  '/events',
  '/careers',
  '/donate',
  '/about',
  '/archbishop',
  '/vocations',
  '/departments',
  '/services',
  '/charities',
  '/parishes',
  '/contact',
  '/register-parishioner',
  '/volunteers',
  '/daily-readings',
  '/decrees',
  '/privacy',
]

export const Route = createFileRoute('/sitemap.xml')({
  server: {
    handlers: {
      GET: async () => {
        const baseUrl = envClient.VITE_APP_URL.replace(/\/+$/, '')
        const locations = await collectLocations(baseUrl)

        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${locations
  .map(
    ({ loc, lastmod }) =>
      `  <url>
    <loc>${loc}</loc>${lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ''}
  </url>`
  )
  .join('\n')}
</urlset>`

        return new Response(xml, {
          headers: {
            'Content-Type': 'application/xml; charset=utf-8',
            'Cache-Control': 'public, max-age=3600',
          },
        })
      },
    },
  },
})

type SitemapLocation = { loc: string; lastmod?: string }

async function collectLocations(baseUrl: string): Promise<SitemapLocation[]> {
  const staticLocations: SitemapLocation[] = STATIC_ROUTES.map((path) => ({
    loc: `${baseUrl}${path}`,
  }))

  try {
    const [{ posts }, { churchEvents }, { jobPostings }] = await Promise.all([
      postRepository.getPosts({
        columns: { slug: true, publishedAt: true },
        pageSize: SITEMAP_ENTRIES_LIMIT,
      }),
      churchEventRepository.getChurchEvents({
        columns: { slug: true },
        pageSize: SITEMAP_ENTRIES_LIMIT,
        includeEndedEvents: true,
      }),
      jobPostingRepository.getJobPostings({
        columns: { slug: true },
        pageSize: SITEMAP_ENTRIES_LIMIT,
      }),
    ])

    return [
      ...staticLocations,
      ...posts.map((post) => ({
        loc: `${baseUrl}/post/${post.slug}`,
        lastmod: formatDate(post.publishedAt),
      })),
      ...churchEvents.map((churchEvent) => ({
        loc: `${baseUrl}/event/${churchEvent.slug}`,
      })),
      ...jobPostings.map((jobPosting) => ({
        loc: `${baseUrl}/job/${jobPosting.slug}`,
      })),
      ...departments.map((department) => ({
        loc: `${baseUrl}/department/${department.slug}`,
      })),
      ...services.map((service) => ({
        loc: `${baseUrl}/service/${service.slug}`,
      })),
      ...programs.map((program) => ({
        loc: `${baseUrl}/charities/program/${program.slug}`,
      })),
    ]
  } catch (err) {
    logger.error({ err }, 'Failed to collect dynamic sitemap URLs, falling back to static routes')
    return staticLocations
  }
}

function formatDate(date: Date | null | undefined): string | undefined {
  return date ? date.toISOString().slice(0, 10) : undefined
}
