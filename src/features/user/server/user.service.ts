import { notFound } from '@tanstack/react-router'
import { getRequestHeaders, setResponseStatus } from '@tanstack/react-start/server'
import { isAPIError } from 'better-auth/api'
import z from 'zod'
import { auth } from '#/server/integrations/auth.server'
import { logger } from '#/server/integrations/logger'
import { accountRepository } from '#/server/repositories/account.repository'
import { ROLE_HIERARCHY } from '#/shared/constants/roles.ts'
import type { User } from '#/shared/lib/types/auth'
import type { UserRole } from '#/shared/types/role.types.ts'
import { getFieldErrors } from '#/utils/form'
import { parseCsvString } from '#/utils/string.ts'
import { DASHBOARD_PAGINATION_LIMIT } from '#shared/constants/dashboard.ts'
import { deleteUserFormSchema, deleteUserServerFunctionSchema } from '../schemas/delete-user-schema'
import { updateUserFormSchema } from '../schemas/user.schema'

export async function deleteUser({ data, user }: { data: unknown; user: User }) {
  const parsed = await deleteUserServerFunctionSchema.parseAsync(data)

  const formParsed = await deleteUserFormSchema(user.name).safeParseAsync(parsed)

  if (!formParsed.success) {
    return { success: false, error: null, validationErrors: getFieldErrors(formParsed.error) }
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
}

export async function getDiscordAccount({ user }: { user: User }) {
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
}

export async function getUsersList({
  data,
}: {
  data: { search: string; page: number; sortBy: string }
}) {
  const headers = getRequestHeaders()

  const sorting = data.sortBy.split('.')

  return auth.api.listUsers({
    query: {
      searchField: 'name',
      searchValue: data.search,
      limit: DASHBOARD_PAGINATION_LIMIT,
      offset: (data.page - 1) * DASHBOARD_PAGINATION_LIMIT,
      sortBy: sorting[0],
      sortDirection: (['desc', 'asc'] as const).find((b) => sorting[1] === b) ?? 'desc',
    },
    headers,
  }) as Promise<{ users: User[]; total: number }>
}

export async function getTargetUser({ data }: { data: { userId: string } }) {
  const headers = getRequestHeaders()

  try {
    const targetUser = await auth.api.getUser({
      query: {
        id: data.userId,
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
}

export async function updateTargetUser({
  data,
  user,
}: {
  data: { targetId: string; roles: string[] }
  user: User
}) {
  const parsed = updateUserFormSchema.safeParse(data)

  if (!parsed.success) {
    return { success: false, error: null, validationErrors: getFieldErrors(parsed.error) }
  }

  const { targetId } = data
  const formData = parsed.data

  try {
    const headers = getRequestHeaders()
    const targetUser = await auth.api.getUser({
      query: { id: targetId },
      headers,
    })

    const submitterRoles: UserRole[] = user.role ? parseCsvString(user.role) : ['user']
    const currentTargetRoles: UserRole[] = targetUser.role
      ? parseCsvString(targetUser.role)
      : ['user']
    const newTargetRoles = formData.roles

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

    logger.error({ err, userId: user.id, targetId: targetId }, 'Failed to update user')
    setResponseStatus(500)
    return { success: false, error: 'Une erreur est survenue' }
  }
}
