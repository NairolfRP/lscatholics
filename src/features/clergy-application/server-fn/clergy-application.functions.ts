import { createServerFn } from '@tanstack/react-start'
import * as clergyApplicationService
  from '#/features/clergy-application/server/clergy-application.service'
import { requireGameMiddleware } from '#/middleware/game.middleware.ts'
import {
  submitClergyApplicationFnSchema,
} from '#/features/clergy-application/schemas/clergy-application.schema.ts'

export const submitClergyApplicationFn = createServerFn({ method: 'POST' })
  .middleware([requireGameMiddleware])
  .validator(submitClergyApplicationFnSchema)
  .handler(({ data, context: { session } }) =>
    clergyApplicationService.submit({ data, user: session.user })
  )
