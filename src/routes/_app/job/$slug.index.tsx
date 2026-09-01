import { createFileRoute } from '@tanstack/react-router'
import { envClient } from '#/config/env-client.ts'
import JobPostingSinglePage from '#/features/job-posting/components/job-posting-single-page.tsx'
import { singleJobPostingQueryOptions } from '#/features/job-posting/queries.ts'
import { pageMetadata } from '#/utils/seo.ts'
import { generateExcerpt } from '#/utils/string.ts'

export const Route = createFileRoute('/_app/job/$slug/')({
  loader: async ({ params: { slug }, context }) => {
    const data = await context.queryClient.ensureQueryData(singleJobPostingQueryOptions(slug))
    return {
      title: data.title,
      slug: data.slug,
      description: data.description,
    }
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? pageMetadata(loaderData.title, {
          metadata: {
            description: loaderData.description
              ? generateExcerpt(loaderData.description, 200)
              : undefined,
            url: `/job/${loaderData.slug}`,
          },
        })
      : undefined,
    links: loaderData
      ? [{ rel: 'canonical', href: `${envClient.VITE_APP_URL}/job/${loaderData.slug}` }]
      : undefined,
  }),
  component: JobPostingSinglePage,
})
