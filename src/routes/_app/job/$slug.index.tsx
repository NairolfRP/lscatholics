import { createFileRoute } from '@tanstack/react-router'
import { envClient } from '#/config/env-client.ts'
import JobPostingSinglePage from '#/features/job-posting/components/job-posting-single-page.tsx'
import { singleJobPostingQueryOptions } from '#/features/job-posting/queries.ts'
import { pageMetadata } from '#/utils/seo.ts'

export const Route = createFileRoute('/_app/job/$slug/')({
  loader: async ({ params: { slug }, context }) => {
    const data = await context.queryClient.ensureQueryData(singleJobPostingQueryOptions(slug))
    return {
      title: data.title,
      slug: data.slug,
    }
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? pageMetadata(loaderData.title, {
          metadata: {
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
