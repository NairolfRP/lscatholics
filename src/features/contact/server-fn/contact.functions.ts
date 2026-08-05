import { createServerFn } from '@tanstack/react-start'
import { requireGameMiddleware } from '#/middleware/game.middleware.ts'
import { looseObjectSchema } from '#shared/schemas/common.schema.ts'
import * as contactService from '#/features/contact/server/contact.service'

export const submitContactFn = createServerFn({ method: 'POST' })
  .middleware([requireGameMiddleware])
  .validator(looseObjectSchema)
  .handler(({ data, context: { session, currentCharacter } }) =>
    contactService.submit({ data, user: session.user, currentCharacter })
  )
