import { getRequestHeaders } from '@tanstack/react-start/server'
import { UnauthorizedException } from '../exceptions/http-exception'
import { auth } from '../integrations/auth.server'
import { logger } from '../integrations/logger'

export async function getSession() {
  try {
    const headers = getRequestHeaders()
    const session = await auth.api.getSession({ headers })

    return session
  } catch (err) {
    logger.error({ err }, 'Error occurred when retrieving user session')
    return null
  }
}

export async function ensureSession() {
  const session = await getSession()

  if (!session) {
    throw UnauthorizedException()
  }

  return session
}

export async function revokeAllSessions() {
  const headers = getRequestHeaders()
  return await auth.api.revokeSessions({ headers })
}

export async function logout() {
  const headers = getRequestHeaders()
  return await auth.api.signOut({ headers })
}

export async function getAccessToken(
  options: { providerId?: string; accountId?: string; userId?: string } = {}
) {
  const { providerId = 'gtaw', ...body } = options
  const headers = getRequestHeaders()
  return auth.api.getAccessToken({
    body: {
      providerId,
      ...body,
    },
    headers,
  })
}
