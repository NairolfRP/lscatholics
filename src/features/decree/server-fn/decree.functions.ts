import { createServerFn } from '@tanstack/react-start'
import { decreeUidSchema } from '#/features/decree/schemas/decree.schema.ts'
import * as decreeService from '#/features/decree/server/decree.service.ts'

export const getDecreesFn = createServerFn({ method: 'GET' }).handler(async () =>
  decreeService.getDecrees()
)

export const getDecreeFn = createServerFn({ method: 'GET' })
  .validator(decreeUidSchema)
  .handler(async ({ data }) => decreeService.getDecree({ threadId: data.threadId }))
