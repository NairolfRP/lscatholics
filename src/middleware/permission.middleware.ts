import { createMiddleware } from '@tanstack/react-start'
import { setResponseStatus } from '@tanstack/react-start/server'
import { UnauthorizedException } from '#/server/exceptions/http-exception.ts'
import { logger } from '#/server/integrations/logger'
import { resolvePermissions } from '#/server/services/permission.service.ts'
import { parseCsvString } from '#/utils/string'
import { requireAuthMiddleware } from './auth.middleware'
import { requireGameMiddleware } from './game.middleware'

export const adminMiddleware = createMiddleware({ type: 'request' })
  .middleware([requireAuthMiddleware])
  .server(async ({ next, context }) => {
    try {
      const session = context.session

      const roles = session.user.role ? parseCsvString(session.user.role) : []

      if (!roles.includes('admin')) {
        throw new Error('Forbidden')
      }

      return next({ context: { session } })
    } catch (err) {
      if (err instanceof Error && err.message === 'Unauthorized') {
        setResponseStatus(401)
        throw err
      }

      if (err instanceof Error && err.message === 'Forbidden') {
        setResponseStatus(403)
        throw err
      }

      logger.error({ err }, 'Admin Middleware failed')
      setResponseStatus(500)
      throw new Error('Internal error')
    }
  })

export function requirePermission(resource: string, action: string) {
  return createMiddleware({ type: 'request' })
    .middleware([requireGameMiddleware])
    .server(async ({ next, context }) => {
      const permissions = resolvePermissions(context.session.user.role, context.currentCharacter)

      if (!permissions[resource]?.includes(action)) {
        throw UnauthorizedException()
      }

      return next({
        context: { session: context.session, currentCharacter: context.currentCharacter },
      })
    })
}
