import type { GTAWCharacter, GTAWProfile } from '@gtaw-oauth-providers/better-auth'
import { getRequest } from '@tanstack/react-start/server'
import { waitUntil } from '@vercel/functions'
import ky from 'ky'
import { defineCachedFunction } from 'nitro/cache'
import { env } from '#/config/env.server'
import type { GTAWClientFetchFactionsResponse } from '#/shared/types/gtaw-client.types'
import { logger } from '../integrations/logger'

const BASE_URL = env.GTAW_SERVER === 'fr' ? 'https://ucp-fr.gta.world' : 'https://ucp.gta.world'
const USER_AGENT = 'BetterAuth/1.0'

type CacheEvent = { req: Request }

function client(accessToken: string) {
  return ky.create({
    prefix: BASE_URL,
    retry: 1,
    timeout: 5000,
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
      'User-Agent': USER_AGENT,
    },
  })
}

function getRequestEvent(): CacheEvent | undefined {
  try {
    return { req: getRequest() }
  } catch {
    return undefined
  }
}

const cachedUserCharacters = defineCachedFunction(
  async (
    _event: CacheEvent | undefined,
    userId: string,
    accessToken: string
  ): Promise<GTAWCharacter[]> => {
    logger.debug({ userId }, 'GTAW Client calling api/user...')
    const response = await client(accessToken).get('api/user').json<GTAWProfile>()
    return response.user.character
  },
  {
    maxAge: 60 * 5, // 5 minutes
    name: 'userCharactersFromAPI',
    getKey: (_event: CacheEvent | undefined, userId: string) => userId,
    waitUntil,
  }
)

const cachedUserFactions = defineCachedFunction(
  async (
    _event: CacheEvent | undefined,
    userId: string,
    accessToken: string
  ): Promise<GTAWClientFetchFactionsResponse['data']> => {
    logger.debug({ userId }, 'GTAW Client calling api/factions...')
    const response = await client(accessToken)
      .get('api/factions')
      .json<GTAWClientFetchFactionsResponse>()
    return response.data
  },
  {
    maxAge: 60 * 5, // 5 minutes
    name: 'userFactionsFromAPI',
    getKey: (_event: CacheEvent | undefined, userId: string) => userId,
    waitUntil,
  }
)

export type ForceRefreshReturnMap = {
  characters: GTAWCharacter[]
  factions: GTAWClientFetchFactionsResponse['data']
}
export type ForceRefreshType = keyof ForceRefreshReturnMap

async function fetchUserCharacters(userId: string, accessToken: string): Promise<GTAWCharacter[]> {
  return cachedUserCharacters(getRequestEvent(), userId, accessToken)
}

async function fetchUserFactions(
  userId: string,
  accessToken: string
): Promise<GTAWClientFetchFactionsResponse['data']> {
  return cachedUserFactions(getRequestEvent(), userId, accessToken)
}

async function forceRefresh<T extends readonly ForceRefreshType[]>(
  userId: string,
  accessToken: string,
  keys: T
): Promise<{ [K in T[number]]: ForceRefreshReturnMap[K] }> {
  const results: Partial<ForceRefreshReturnMap> = {}

  const event = getRequestEvent()

  const promises = keys.map(async (type) => {
    switch (type) {
      case 'characters':
        await cachedUserCharacters.invalidate(event, userId, accessToken)
        logger.debug({ userId }, 'User characters cache invalidated')
        results.characters = await cachedUserCharacters(event, userId, accessToken)
        break

      case 'factions':
        await cachedUserFactions.invalidate(event, userId, accessToken)
        logger.debug({ userId }, 'User factions cache invalidated')
        results.factions = await cachedUserFactions(event, userId, accessToken)
        break
    }
  })

  if (!Array.isArray(promises) || promises.length === 0) {
    throw new Error('Unable to force a refresh because the keys are invalid')
  }

  await Promise.all(promises)

  return results as { [K in T[number]]: ForceRefreshReturnMap[K] }
}

export const gtawClient = {
  fetchUserCharacters,
  fetchUserFactions,
  forceRefresh,
}
