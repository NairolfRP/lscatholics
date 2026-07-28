import { createServerFn } from '@tanstack/react-start'
import { gameMiddleware } from '#/middleware/game.middleware'
import { resolvePermissions } from '#/server/services/permission.service'

export const getGameContextFn = createServerFn({ method: 'GET' })
  .middleware([gameMiddleware])
  .handler(({ context }) => {
    if (!context.session) {
      return {
        characters: [],
        currentCharacter: null,
        canAccessDashboard: false,
        permissions: {},
      }
    }

    const { session, characters, currentCharacter } = context
    const permissions = resolvePermissions(session.user.role, currentCharacter)
    const canAccessDashboard = permissions.dashboard.includes('access')

    return { user: session.user, characters, currentCharacter, canAccessDashboard, permissions }
  })
