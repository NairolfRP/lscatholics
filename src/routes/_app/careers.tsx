import { createFileRoute, redirect, stripSearchParams } from '@tanstack/react-router'
import JobPostingsPage from '#/features/job-posting/components/job-postings-page.tsx'
import { CAREERS_PAGINATION_LIMIT } from '#/features/job-posting/constants/job-posting.constants.ts'
import { jobPostingsQueryOptions } from '#/features/job-posting/queries.ts'
import { jobPostingsSearchSchema } from '#/features/job-posting/schemas/job-posting.schema.ts'
import { pageMetadata } from '#/utils/seo.ts'

export const Route = createFileRoute('/_app/careers')({
  validateSearch: jobPostingsSearchSchema,
  search: {
    middlewares: [stripSearchParams({ page: 1, search: '', department: undefined, type: [] })],
  },
  beforeLoad: async ({ context, search }) => {
    const { total } = await context.queryClient.ensureQueryData(jobPostingsQueryOptions(search))

    const totalPages = Math.ceil(total / CAREERS_PAGINATION_LIMIT)

    if (search.page > totalPages && totalPages > 0) {
      throw redirect({ to: '.', search: (prev) => ({ ...prev, page: totalPages }), replace: true })
    }
  },
  head: () => ({
    meta: pageMetadata("Offres d'emploi"),
  }),
  component: JobPostingsPage,
})
