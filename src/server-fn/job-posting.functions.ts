import { createServerFn } from '@tanstack/react-start'
import {
  baseJobPostingInteractionSchema,
  jobPostingsSearchSchema,
} from '#/features/job-posting/schemas/job-posting.schema'
import { requirePermission } from '#/middleware/permission.middleware'
import * as jobPostingService from '#server/services/job-posting.service'
import { getJobPostings, getSingleJobPosting } from '#server/services/job-posting.service'
import { dashboardSearchSchema } from '#shared/schemas/dashboard/search.schema'
import { slugSchema } from '#shared/schemas/slug.schema.ts'
import { looseObjectSchema } from '#shared/schemas/utils.schema.ts'

export const getSingleJobPostingFn = createServerFn({ method: 'GET' })
  .validator(slugSchema)
  .handler(async ({ data: slug }) => getSingleJobPosting({ slug }))

export const getJobPostingsFn = createServerFn({ method: 'GET' })
  .validator(jobPostingsSearchSchema)
  .handler(async ({ data }) => getJobPostings(data))

export const getDashboardJobPostingFn = createServerFn({ method: 'GET' })
  .middleware([requirePermission('job', 'read')])
  .validator((id: string) => id)
  .handler(async ({ data }) => jobPostingService.getDashboardJobPosting({ id: data }))

export const getDashboardJobPostingsFn = createServerFn({ method: 'GET' })
  .middleware([requirePermission('job', 'read')])
  .validator(dashboardSearchSchema)
  .handler(async ({ data }) => jobPostingService.getDashboardJobPostings({ data }))

export const jobPostingDeleteFn = createServerFn({ method: 'POST' })
  .middleware([requirePermission('job', 'delete')])
  .validator(baseJobPostingInteractionSchema)
  .handler(async ({ data, context }) =>
    jobPostingService.deleteJobPosting({
      jobPostingId: data.jobPostingId,
      user: context.session.user,
    })
  )

export const toggleJobPostingActiveStateFn = createServerFn({ method: 'POST' })
  .middleware([requirePermission('job', 'update')])
  .validator(baseJobPostingInteractionSchema)
  .handler(async ({ data, context }) =>
    jobPostingService.toggleJobPostingActiveState({
      jobPostingId: data.jobPostingId,
      user: context.session.user,
    })
  )

export const createJobPostingFn = createServerFn({ method: 'POST' })
  .middleware([requirePermission('job', 'create')])
  .validator(looseObjectSchema)
  .handler(async ({ data, context }) =>
    jobPostingService.createJobPosting({ data, user: context.session.user })
  )

export const updateJobPostingFn = createServerFn({ method: 'POST' })
  .middleware([requirePermission('job', 'update')])
  .validator(looseObjectSchema)
  .handler(async ({ data, context }) =>
    jobPostingService.updateJobPosting({ data, user: context.session.user })
  )
