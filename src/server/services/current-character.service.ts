import { deleteCookie, getCookie, setCookie, setResponseStatus } from '@tanstack/react-start/server'
import { isAPIError } from 'better-auth/api'
import { env } from '#/config/env.server'
import type { Character, CharacterWithFaction } from '#/shared/types/character.types'
import { logger } from '../integrations/logger'
import { logout, revokeAllSessions } from './auth.service'
import { getAllUserCharacters, getAllUserCharactersWithFactions } from './character.service'
import { resolvePermissions } from './permission.service'

export const CURRENT_CHARACTER_COOKIE_NAME = 'lscatholics.current_character'

export function getCurrentCharacter(args: {
  withFaction: true
  withAllCharacters: true
  forceRefresh?: boolean
}): Promise<{
  currentCharacter: CharacterWithFaction
  characters: CharacterWithFaction[]
} | null>

export function getCurrentCharacter(args: {
  withFaction: true
  withAllCharacters?: false
  forceRefresh?: boolean
}): Promise<CharacterWithFaction | null>

export function getCurrentCharacter(args: {
  withFaction?: false
  withAllCharacters: true
  forceRefresh?: boolean
}): Promise<{
  currentCharacter: Character
  characters: Character[]
} | null>

export function getCurrentCharacter(args?: {
  withFaction?: false
  withAllCharacters?: false
  forceRefresh?: boolean
}): Promise<Character | null>

export async function getCurrentCharacter({
  withFaction,
  withAllCharacters,
  forceRefresh,
}: {
  withFaction?: boolean
  withAllCharacters?: boolean
  forceRefresh?: boolean
} = {}): Promise<
  | Character
  | CharacterWithFaction
  | {
      currentCharacter: Character | CharacterWithFaction
      characters: (Character | CharacterWithFaction)[]
    }
  | null
> {
  try {
    let userCharacters: Character[] | CharacterWithFaction[] = []

    if (withFaction) {
      userCharacters = await getAllUserCharactersWithFactions(undefined, { forceRefresh })
    } else {
      userCharacters = await getAllUserCharacters(undefined, { forceRefresh })
    }

    if (userCharacters.length === 0) {
      deleteCookie(CURRENT_CHARACTER_COOKIE_NAME)
      await Promise.all([revokeAllSessions(), logout()])
      return null
    }

    const currentCharacterIdFromCookie = getCookie(CURRENT_CHARACTER_COOKIE_NAME)

    if (!currentCharacterIdFromCookie) {
      if (!withAllCharacters) {
        return userCharacters[0]
      }

      return { currentCharacter: userCharacters[0], characters: userCharacters }
    }

    const currentCharacter = userCharacters.find(
      (char) => char.id === Number.parseInt(currentCharacterIdFromCookie, 10)
    )

    const isValidCharacter = !!currentCharacter
    if (!isValidCharacter) {
      deleteCookie(CURRENT_CHARACTER_COOKIE_NAME)

      if (!withAllCharacters) {
        return userCharacters[0]
      }

      return { currentCharacter: userCharacters[0], characters: userCharacters }
    }

    if (!withAllCharacters) {
      return currentCharacter
    }

    return { currentCharacter, characters: userCharacters }
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return null
    }

    if (isAPIError(error) && (error.status === 'UNAUTHORIZED' || error.statusCode === 401)) {
      return null
    }

    logger.error({ err: error }, 'Error fetching current character')
    return null
  }
}

export function setCurrentCharacter(characterId: number) {
  setCookie(CURRENT_CHARACTER_COOKIE_NAME, String(characterId), {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  })
}

export async function updateCurrentCharacter({
  characterId,
  characters,
  session,
}: {
  characterId: number
  characters: CharacterWithFaction[]
  session: { user: { role: string } }
}) {
  if (characters.length === 0) {
    await Promise.all([revokeAllSessions(), logout()])
    throw new Error('Cannot switch character. The user has no more characters')
  }

  const character = characters.find((char) => char.id === characterId)

  if (!character) {
    setResponseStatus(400)
    throw new Error('Not owner of the character or the character does not exist anymore')
  }

  setCurrentCharacter(character.id)

  const permissions = resolvePermissions(session.user.role, character)

  return {
    success: true,
    data: {
      characters,
      currentCharacter: character,
      canAccessDashboard: permissions.dashboard.includes('access'),
      permissions,
    },
  }
}
