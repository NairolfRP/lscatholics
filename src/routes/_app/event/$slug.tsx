import { createFileRoute } from '@tanstack/react-router'
import { envClient } from '#/config/env-client.ts'
import { ChurchEventSinglePage } from '#/features/church-event/components/church-event-single-page.tsx'
import { singleChurchEventQueryOptions } from '#/features/church-event/queries.ts'
import { pageMetadata } from '#/utils/seo.ts'

export const Route = createFileRoute('/_app/event/$slug')({
  loader: async ({ params: { slug }, context }) => {
    const data = await context.queryClient.ensureQueryData(singleChurchEventQueryOptions(slug))

    return {
      title: data.title,
      slug: data.slug,
      image: data.coverImageUrl,
      description: data.description,
      location: data.location,
      startDate: data.startDate,
      endDate: data.endDate,
    }
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? pageMetadata(loaderData.title, {
          metadata: {
            ...(loaderData.image ? { image: loaderData.image } : {}),
            ...(loaderData.description ? { description: loaderData.description } : {}),
            url: `/event/${loaderData.slug}`,
          },
          overrides: [
            {
              property: 'og:type',
              content: 'event',
            },
            {
              name: 'twitter:card',
              content: 'summary_large_image',
            },
          ],
        })
      : undefined,
    links: loaderData
      ? [{ rel: 'canonical', href: `${envClient.VITE_APP_URL}/event/${loaderData.slug}` }]
      : undefined,
    scripts: loaderData
      ? [
          {
            type: 'application/ld+json',
            children: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Event',
              'name': loaderData.title,
              'description': loaderData.description,
              'startDate': loaderData.startDate.toISOString(),
              ...(loaderData.endDate ? { endDate: loaderData.endDate.toISOString() } : {}),
              'eventAttendanceMode': 'https://schema.org/OnlineEventAttendanceMode',
              'location': {
                '@type': 'VirtualLocation',
                'name': 'GTA World',
                'url': 'https://gta.world',
              },
              'organizer': {
                '@type': 'Organization',
                'name': 'Archidiocèse de Los Santos',
              },
              'about': [
                {
                  '@type': 'VideoGame',
                  'name': 'Grand Theft Auto V',
                },
                {
                  '@type': 'CreativeWork',
                  'name': 'GTA World',
                },
              ],
            }),
          },
        ]
      : undefined,
  }),
  component: ChurchEventSinglePage,
})
