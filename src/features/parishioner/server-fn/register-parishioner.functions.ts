import { createServerFn } from '@tanstack/react-start'
import { requireGameMiddleware } from '#/middleware/game.middleware.ts'
import { looseObjectSchema } from '#shared/schemas/common.schema.ts'
import * as registerParishionerService from '#/features/parishioner/server/register-parishioner.service'

export const submitRegisterParishionerFn = createServerFn({ method: 'POST' })
  .middleware([requireGameMiddleware])
  .validator(looseObjectSchema)
  .handler(({ data, context: { session } }) =>
    registerParishionerService.submit({ data, user: session.user })
  )
