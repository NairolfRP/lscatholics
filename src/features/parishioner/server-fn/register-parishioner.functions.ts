import { createServerFn } from '@tanstack/react-start'
import * as registerParishionerService
  from '#/features/parishioner/server/register-parishioner.service'
import { requireGameMiddleware } from '#/middleware/game.middleware.ts'
import { looseObjectSchema } from '#shared/schemas/utils.schema.ts'

export const submitRegisterParishionerFn = createServerFn({ method: 'POST' })
  .middleware([requireGameMiddleware])
  .validator(looseObjectSchema)
  .handler(({ data, context: { session } }) =>
    registerParishionerService.submit({ data, user: session.user })
  )
