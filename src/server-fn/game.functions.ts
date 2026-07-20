import { createServerFn } from '@tanstack/react-start'
import { gameMiddleware } from '#/middleware/game.middleware'
import { checkCanAccessDashboard } from '#/server/services/permission.service'

export const getGameContextFn = createServerFn({ method: 'GET' })
  .middleware([gameMiddleware])
  .handler(({ context }) => {
    if (!context.session) {
      return { characters: [], currentCharacter: null, canAccessDashboard: false }
    }

    const { session, characters, currentCharacter } = context

    const canAccessDashboard = checkCanAccessDashboard(session.user.role, currentCharacter)

    return { user: session.user, characters, currentCharacter, canAccessDashboard }
  })
