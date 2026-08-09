import { createServerFn } from '@tanstack/react-start'
import * as contactService from '#/features/contact/server/contact.service'
import { requireGameMiddleware } from '#/middleware/game.middleware.ts'
import { looseObjectSchema } from '#shared/schemas/utils.schema.ts'

export const submitContactFn = createServerFn({ method: 'POST' })
  .middleware([requireGameMiddleware])
  .validator(looseObjectSchema)
  .handler(({ data, context: { session } }) => contactService.submit({ data, user: session.user }))
