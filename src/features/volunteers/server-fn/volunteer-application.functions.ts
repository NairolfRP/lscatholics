import { createServerFn } from '@tanstack/react-start'
import { requireGameMiddleware } from '#/middleware/game.middleware.ts'
import { looseObjectSchema } from '#shared/schemas/common.schema.ts'
import * as volunteerApplicationService
  from '#/features/volunteers/server/volunteer-application.service'

export const submitVolunteerApplicationFn = createServerFn({ method: 'POST' })
  .middleware([requireGameMiddleware])
  .validator(looseObjectSchema)
  .handler(({ data, context: { session } }) =>
    volunteerApplicationService.submit({ data, user: session.user })
  )
