import { createServerFn } from '@tanstack/react-start'
import { bankTransfer, getBankBalance } from '#/features/banking/server/banking.service.ts'
import { requirePermission } from '#/middleware/permission.middleware.ts'
import { looseObjectSchema } from '#shared/schemas/utils.schema.ts'

export const getBankBalanceFn = createServerFn({ method: 'GET' })
  .middleware([requirePermission('finances', 'read')])
  .handler(() => getBankBalance())

export const bankTransferFn = createServerFn({ method: 'POST' })
  .middleware([requirePermission('finances', 'transaction')])
  .validator(looseObjectSchema)
  .handler(({ data, context }) =>
    bankTransfer({
      data,
      user: context.session.user,
      currentCharacter: context.currentCharacter,
    })
  )
