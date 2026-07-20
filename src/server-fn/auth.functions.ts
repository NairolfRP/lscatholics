import { createServerFn } from '@tanstack/react-start'
import { UnauthorizedException } from '#/server/exceptions/http-exception'
import { getSession } from '#/server/services/auth.service'

export const getSessionFn = createServerFn({ method: 'GET' }).handler(async () => {
  const session = await getSession()
  return session
})

export const getCurrentUserFn = createServerFn({ method: 'GET' }).handler(async () => {
  const session = await getSession()
  return session?.user
})

export const ensureSessionFn = createServerFn({ method: 'GET' }).handler(async () => {
  const session = await getSession()

  if (!session) {
    throw UnauthorizedException()
  }

  return session
})
