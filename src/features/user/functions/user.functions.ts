import { notFound } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { getRequestHeaders, setResponseStatus } from '@tanstack/react-start/server'
import { isAPIError } from 'better-auth/api'
import z from 'zod'
import { DASHBOARD_PAGINATION_LIMIT } from '#/features/dashboard/constants/dashboard-pagination'
import { dashboardSearchSchema } from '#/features/dashboard/schemas/dashboard-search.schema'
import { requireAuthMiddleware } from '#/middleware/auth.middleware'
import { adminMiddleware } from '#/middleware/permission.middleware'
import { auth } from '#/server/integrations/auth.server'
import { logger } from '#/server/integrations/logger'
import { accountRepository } from '#/server/repositories/account.repository'
import { ROLE_HIERARCHY } from '#/shared/constants/roles.ts'
import type { User } from '#/shared/lib/types/auth'
import type { UserRole } from '#/shared/types/role.types.ts'
import { getFieldErrors } from '#/utils/form'
import { parseCsvString } from '#/utils/string.ts'
import { deleteUserFormSchema, deleteUserServerFunctionSchema } from '../schemas/delete-user-schema'
import {
  updateUserFormSchema,
  updateUserServerFnSchema,
  userIdSchema,
} from '../schemas/user.schema'

export const deleteUserFn = createServerFn({ method: 'POST' })
  .validator(deleteUserServerFunctionSchema)
  .middleware([requireAuthMiddleware])
  .handler(async ({ data, context }) => {
    const user = context.session.user

    const parsed = await deleteUserFormSchema(user.name).safeParseAsync(data)

    if (!parsed.success) {
      return { success: false, error: null, validationErrors: getFieldErrors(parsed.error) }
    }

    try {
      const headers = getRequestHeaders()
      const result = await auth.api.deleteUser({
        body: {},
        headers,
      })

      if (!result.success) {
        throw new Error('Failed to delete user')
      }

      return { success: true, error: null, validationErrors: null }
    } catch (err) {
      if (err instanceof z.ZodError) {
        return { success: false, error: null, validationErrors: getFieldErrors(err) }
      }

      if (isAPIError(err)) {
        if (err.statusCode === 400 && err.body?.code === 'SESSION_EXPIRED') {
          return { success: false, error: { code: 'SESSION_NOT_FRESH', status: 403 } }
        }
      }

      logger.error(
        { err, username: user.name, date: new Date().toISOString() },
        "Failed to delete user '%d' (uuid: %d)",
        user.name,
        user.id
      )

      setResponseStatus(500)
      return { success: false, error: { code: 'INTERNAL_ERROR', status: 500 } }
    }
  })

export const getDiscordAccountFn = createServerFn({ method: 'GET' })
  .middleware([requireAuthMiddleware])
  .handler(async ({ context }) => {
    const {
      session: { user },
    } = context

    const account = await accountRepository.getDiscordAccount({
      userId: user.id,
      columns: { accountId: true },
    })

    if (!account) {
      return null
    }

    const headers = getRequestHeaders()
    const discordUserInfo = await auth.api.accountInfo({
      query: { accountId: account.accountId },
      headers,
    })

    if (!discordUserInfo) {
      return null
    }

    return {
      id: account.accountId,
      username: discordUserInfo.data.username,
      avatar: discordUserInfo.user.image,
    }
  })

export const getUsersListFn = createServerFn({ method: 'GET' })
  .middleware([adminMiddleware])
  .validator(dashboardSearchSchema)
  .handler(({ data: { search, page, sortBy } }) => {
    const headers = getRequestHeaders()

    const sorting = sortBy.split('.')

    return auth.api.listUsers({
      query: {
        searchField: 'name',
        searchValue: search,
        limit: DASHBOARD_PAGINATION_LIMIT,
        offset: (page - 1) * DASHBOARD_PAGINATION_LIMIT,
        sortBy: sorting[0],
        sortDirection: (['desc', 'asc'] as const).find((b) => sorting[1] === b) ?? 'desc',
      },
      headers,
    }) as Promise<{ users: Array<User>; total: number }>
  })

export const getTargetUserFn = createServerFn({ method: 'GET' })
  .middleware([adminMiddleware])
  .validator((data: unknown) => {
    const result = userIdSchema.safeParse(data)
    if (!result.success) {
      throw notFound()
    }
    return result.data
  })
  .handler(async ({ data: { userId } }) => {
    const headers = getRequestHeaders()

    try {
      const targetUser = await auth.api.getUser({
        query: {
          id: userId,
        },
        headers,
      })

      return targetUser
    } catch (err) {
      if (isAPIError(err)) {
        if (err.statusCode === 404) {
          throw notFound()
        }
      }

      if (err instanceof z.ZodError) {
        throw notFound()
      }

      logger.error({ err }, '[getTargetUserFn] Error occured')
      throw new Error('Internal server error')
    }
  })

export const updateTargetUserFn = createServerFn({ method: 'POST' })
  .middleware([adminMiddleware])
  .validator(updateUserServerFnSchema)
  .handler(async ({ data: rawData, context: { session } }) => {
    const parsed = updateUserFormSchema.safeParse(rawData)

    if (!parsed.success) {
      return { success: false, error: null, validationErrors: getFieldErrors(parsed.error) }
    }

    const { targetId } = rawData
    const data = parsed.data

    try {
      const headers = getRequestHeaders()
      const targetUser = await auth.api.getUser({
        query: { id: targetId },
        headers,
      })

      const submitterRoles: Array<UserRole> = session.user.role
        ? parseCsvString(session.user.role)
        : ['user']
      const currentTargetRoles: Array<UserRole> = targetUser.role
        ? parseCsvString(targetUser.role)
        : ['user']
      const newTargetRoles = data.roles

      const submitterMaxLevel = Math.max(...submitterRoles.map((r) => ROLE_HIERARCHY[r]))

      const addedRoles = newTargetRoles.filter((r) => !currentTargetRoles.includes(r))
      const removedRoles = currentTargetRoles.filter((r) => !newTargetRoles.includes(r))

      const forbiddenRoles = [...addedRoles, ...removedRoles].filter(
        (role) => ROLE_HIERARCHY[role] >= submitterMaxLevel
      )

      if (forbiddenRoles.length > 0) {
        setResponseStatus(403)
        return {
          success: false,
          error: null,
          validationErrors: {
            roles: [
              {
                message:
                  'Vous ne pouvez pas ajouter ou retirer des rôles supérieurs ou égaux aux vôtres.',
              },
            ],
          },
        }
      }

      await auth.api.setRole({
        body: { userId: targetId, role: newTargetRoles },
        headers,
      })

      return { success: true, error: null, validationErrors: null }
    } catch (err) {
      if (isAPIError(err)) {
        setResponseStatus(err.statusCode)
        return {
          success: false,
          error: err.message,
        }
      }

      logger.error({ err, userId: session.user.id, targetId: targetId }, 'Failed to update user')
      setResponseStatus(500)
      return { success: false, error: 'Une erreur est survenue' }
    }
  })
