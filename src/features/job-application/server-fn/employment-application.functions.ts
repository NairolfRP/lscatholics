import { createServerFn } from '@tanstack/react-start'
import * as employmentApplicationService from '#/features/job-application/server/employment-application.service'
import { requireGameMiddleware } from '#/middleware/game.middleware.ts'

type SubmitEmploymentApplicationPayload = { slug: string; data: unknown }

export const submitEmploymentApplicationFn = createServerFn({ method: 'POST' })
  .middleware([requireGameMiddleware])
  .validator((payload: SubmitEmploymentApplicationPayload) => ({
    slug: payload.slug,
    data: payload.data,
  }))
  .handler(({ data, context: { session } }) =>
    employmentApplicationService.submit({
      slug: data.slug,
      data: data.data,
      user: session.user,
    })
  )
