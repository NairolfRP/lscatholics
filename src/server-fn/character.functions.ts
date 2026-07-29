import { createServerFn } from '@tanstack/react-start'
import { silentAuthMiddleware } from '#/middleware/auth.middleware'
import { requireGameMiddleware } from '#/middleware/game.middleware'
import { characterIdSchema } from '#/server/schemas/character.schema'
import {
  getCurrentCharacter,
  updateCurrentCharacter,
} from '#/server/services/current-character.service'

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
  .handler(async ({ data: characterId, context }) =>
    updateCurrentCharacter({
      characterId,
      characters: context.characters,
      session: context.session,
    })
  )
