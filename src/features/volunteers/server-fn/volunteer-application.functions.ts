import { createServerFn } from '@tanstack/react-start'
import * as volunteerApplicationService from '#/features/volunteers/server/volunteer-application.service'
import { requireGameMiddleware } from '#/middleware/game.middleware.ts'
import { looseObjectSchema } from '#shared/schemas/utils.schema.ts'

export const submitVolunteerApplicationFn = createServerFn({ method: 'POST' })
  .middleware([requireGameMiddleware])
  .validator(looseObjectSchema)
  .handler(({ data, context: { session } }) =>
    volunteerApplicationService.submit({ data, user: session.user })
  )
