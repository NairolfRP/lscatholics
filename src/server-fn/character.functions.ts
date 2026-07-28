import { createServerFn } from '@tanstack/react-start'
import { setResponseStatus } from '@tanstack/react-start/server'
import { silentAuthMiddleware } from '#/middleware/auth.middleware'
import { requireGameMiddleware } from '#/middleware/game.middleware'
import { characterIdSchema } from '#/server/schemas/character.schema'
import { logout, revokeAllSessions } from '#/server/services/auth.service'
import {
  getCurrentCharacter,
  setCurrentCharacter,
} from '#/server/services/current-character.service'
import { resolvePermissions } from '#/server/services/permission.service'

export const getCurrentCharacterFn = createServerFn({ method: 'GET' })
  .middleware([silentAuthMiddleware])
  .handler(async ({ context }) => {
    if (!context.session) return null

    const currentCharacter = await getCurrentCharacter()

    return currentCharacter
  })

export const updateCurrentCharacterFn = createServerFn({ method: 'POST' })
  .validator(characterIdSchema)
  .middleware([requireGameMiddleware])
  .handler(async ({ data: characterId, context }) => {
    if (context.characters.length === 0) {
      await Promise.all([revokeAllSessions(), logout()])
      throw new Error('Cannot switch character. The user has no more characters')
    }

    const character = context.characters.find((char) => char.id === characterId)

    const isValidCharacter = !!character
    if (!isValidCharacter) {
      setResponseStatus(400)
      throw new Error('Not owner of the character or the character does not exist anymore')
    }

    setCurrentCharacter(character.id)

    const permissions = resolvePermissions(context.session.user.role, character)

    return {
      success: true,
      data: {
        characters: context.characters,
        currentCharacter: character,
        canAccessDashboard: permissions.dashboard.includes('access'),
        permissions,
      },
    }
  })
