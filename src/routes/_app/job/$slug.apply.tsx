import { createFileRoute } from '@tanstack/react-router'
import { envClient } from '#/config/env-client.ts'
import {
  EmploymentApplicationPageSkeleton,
} from '#/features/job-application/components/employment-application-page-skeleton.tsx'
import {
  EmploymentApplicationPage,
} from '#/features/job-application/components/employment-application-page.tsx'
import { singleJobPostingQueryOptions } from '#/features/job-posting/queries.ts'
import { pageMetadata } from '#/utils/seo.ts'

export const Route = createFileRoute('/_app/job/$slug/apply')({
  pendingMs: 200,
  pendingComponent: EmploymentApplicationPageSkeleton,
  loader: async ({ params: { slug }, context }) => {
    const job = await context.queryClient.ensureQueryData(singleJobPostingQueryOptions(slug))

    return { slug, title: job.title }
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? pageMetadata(`Candidature — ${loaderData.title}`, {
          metadata: {
            description: `Postulez à l'offre d'emploi « ${loaderData.title} » de l'Archidiocèse de Los Santos.`,
            url: `/job/${loaderData.slug}/apply`,
          },
        })
      : pageMetadata("Demande d'emploi"),
    ...(loaderData
      ? {
          links: [
            {
              rel: 'canonical',
              href: `${envClient.VITE_APP_URL}/job/${loaderData.slug}/apply`,
            },
          ],
        }
      : {}),
  }),
  component: EmploymentApplicationPage,
})
