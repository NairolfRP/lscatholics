import { createFileRoute, notFound, redirect } from '@tanstack/react-router'
import { envClient } from '#/config/env-client.ts'
import {
  DecreeSinglePage,
  DecreeSinglePageSkeleton,
} from '#/features/decree/components/decree-single-page.tsx'
import { DECREE_CATEGORIES } from '#/features/decree/constants/decree.constants.ts'
import { decreeQueryOptions } from '#/features/decree/queries.ts'
import { parseDecreeUid } from '#/features/decree/utils/decree.utils.ts'
import { pageMetadata } from '#/utils/seo.ts'

export const Route = createFileRoute('/_app/decrees/$uid')({
  pendingMs: 200,
  pendingComponent: DecreeSinglePageSkeleton,
  loader: async ({ params: { uid }, context }) => {
    if (parseDecreeUid(uid) === null) throw notFound()

    const detail = await context.queryClient.ensureQueryData(decreeQueryOptions(uid))

    if (!detail) throw notFound()
    if (detail.canonicalUid !== uid) {
      throw redirect({ to: '/decrees/$uid', params: { uid: detail.canonicalUid }, statusCode: 301 })
    }

    return detail
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? pageMetadata(loaderData.decree.title, {
          metadata: {
            ...(loaderData.decree.image ? { image: loaderData.decree.image } : {}),
            ...(loaderData.decree.description
              ? { description: loaderData.decree.description }
              : {}),
            url: `/decrees/${loaderData.decree.uid}`,
            article: {
              publishedTime: loaderData.decree.publishedAt ?? '',
              section: DECREE_CATEGORIES[loaderData.decree.category].label,
            },
          },
          overrides: [
            {
              property: 'og:type',
              content: 'article',
            },
            {
              name: 'twitter:card',
              content: loaderData.decree.image ? 'summary_large_image' : 'summary',
            },
          ],
        })
      : pageMetadata('Décrets et lois'),
    ...(loaderData
      ? {
          links: [
            {
              rel: 'canonical',
              href: `${envClient.VITE_APP_URL}/decrees/${loaderData.decree.uid}`,
            },
          ],
          scripts: [
            {
              type: 'application/ld+json',
              children: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'Article',
                'headline': loaderData.decree.title,
                'description': loaderData.decree.description,
                'datePublished': loaderData.decree.publishedAt,
                'articleSection': DECREE_CATEGORIES[loaderData.decree.category].label,
                'image': loaderData.decree.image,
                'author': {
                  '@type': 'Organization',
                  'name': 'Archidiocèse de Los Santos',
                },
                'publisher': {
                  '@type': 'Organization',
                  'name': 'Archidiocèse de Los Santos',
                },
              }),
            },
          ],
        }
      : {}),
  }),
  component: DecreeSinglePage,
})
