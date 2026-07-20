import { createMiddleware } from '@tanstack/react-start'
import { setResponseStatus } from '@tanstack/react-start/server'
import { getCurrentCharacter } from '#/server/services/current-character.service'
import { silentAuthMiddleware } from './auth.middleware'

export const gameMiddleware = createMiddleware()
  .middleware([silentAuthMiddleware])
  .server(async ({ next, context }) => {
    if (!context.session) {
      return next({ context: { characters: [], currentCharacter: null } })
    }

    const result = await getCurrentCharacter({
      withFaction: true,
      withAllCharacters: true,
    })

    return next({
      context: {
        currentCharacter: result?.currentCharacter ?? null,
        characters: result?.characters ?? [],
      },
    })
  })

export const requireGameMiddleware = createMiddleware()
  .middleware([gameMiddleware])
  .server(async ({ next, context }) => {
    if (!context.session) {
      setResponseStatus(401)
      throw new Error('Unauthorized')
    }

    return next({ context: { ...context, session: context.session } })
  })
