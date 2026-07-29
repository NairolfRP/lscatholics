import { createServerFn } from '@tanstack/react-start'
import { requireAuthMiddleware } from '#/middleware/auth.middleware'
import { adminMiddleware } from '#/middleware/permission.middleware'
import { dashboardSearchSchema } from '#shared/schemas/dashboard/search.schema'
import { deleteUserServerFunctionSchema } from '../schemas/delete-user-schema'
import { updateUserServerFnSchema, userIdSchema } from '../schemas/user.schema'
import * as userService from '../server/user.service'

export const deleteUserFn = createServerFn({ method: 'POST' })
  .validator(deleteUserServerFunctionSchema)
  .middleware([requireAuthMiddleware])
  .handler(async ({ data, context }) =>
    userService.deleteUser({ data, user: context.session.user })
  )

export const getDiscordAccountFn = createServerFn({ method: 'GET' })
  .middleware([requireAuthMiddleware])
  .handler(async ({ context }) => userService.getDiscordAccount({ user: context.session.user }))

export const getUsersListFn = createServerFn({ method: 'GET' })
  .middleware([adminMiddleware])
  .validator(dashboardSearchSchema)
  .handler(async ({ data }) => userService.getUsersList({ data }))

export const getTargetUserFn = createServerFn({ method: 'GET' })
  .middleware([adminMiddleware])
  .validator(userIdSchema)
  .handler(async ({ data }) => userService.getTargetUser({ data }))

export const updateTargetUserFn = createServerFn({ method: 'POST' })
  .middleware([adminMiddleware])
  .validator(updateUserServerFnSchema)
  .handler(async ({ data, context }) =>
    userService.updateTargetUser({ data, user: context.session.user })
  )
