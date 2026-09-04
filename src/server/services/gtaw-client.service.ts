import type { GTAWCharacter, GTAWProfile } from '@gtaw-oauth-providers/better-auth'
import { createHash } from 'node:crypto'
import { getRequest } from '@tanstack/react-start/server'
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
    timeout: 8000,
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
  async (_event: CacheEvent | undefined, accessToken: string): Promise<GTAWCharacter[]> => {
    logger.debug('GTAW Client calling api/user...')
    const response = await client(accessToken).get('api/user').json<GTAWProfile>()
    return response.user.character
  },
  {
    maxAge: 60 * 5, // 5 minutes
    name: 'userCharactersFromAPI',
    getKey: (_event: CacheEvent | undefined, token: string) => hashToken(token),
  }
)

const cachedUserFactions = defineCachedFunction(
  async (
    _event: CacheEvent | undefined,
    accessToken: string
  ): Promise<GTAWClientFetchFactionsResponse['data']> => {
    logger.debug('GTAW Client calling api/factions...')
    const response = await client(accessToken)
      .get('api/factions')
      .json<GTAWClientFetchFactionsResponse>()
    return response.data
  },
  {
    maxAge: 60 * 5, // 5 minutes
    name: 'userFactionsFromAPI',
    getKey: (_event: CacheEvent | undefined, token: string) => hashToken(token),
  }
)

export type ForceRefreshReturnMap = {
  characters: GTAWCharacter[]
  factions: GTAWClientFetchFactionsResponse['data']
}
export type ForceRefreshType = keyof ForceRefreshReturnMap

async function fetchUserCharacters(accessToken: string): Promise<GTAWCharacter[]> {
  return cachedUserCharacters(getRequestEvent(), accessToken)
}

async function fetchUserFactions(
  accessToken: string
): Promise<GTAWClientFetchFactionsResponse['data']> {
  return cachedUserFactions(getRequestEvent(), accessToken)
}

async function forceRefresh<T extends readonly ForceRefreshType[]>(
  accessToken: string,
  keys: T
): Promise<{ [K in T[number]]: ForceRefreshReturnMap[K] }> {
  const results: Partial<ForceRefreshReturnMap> = {}

  const event = getRequestEvent()

  const promises = keys.map(async (type) => {
    switch (type) {
      case 'characters':
        // @ts-expect-error There is a known typing issue that has already been fixed in https://github.com/nitrojs/nitro/pull/4377. Wait for release.
        await cachedUserCharacters.invalidate(event, accessToken)
        logger.debug(`User characters cache invalidated for token %s`, accessToken)
        results.characters = await cachedUserCharacters(event, accessToken)
        break

      case 'factions':
        // @ts-expect-error There is a known typing issue that has already been fixed in https://github.com/nitrojs/nitro/pull/4377. Wait for release.
        await cachedUserFactions.invalidate(event, accessToken)
        logger.debug(`User factions cache invalidated for token %s`, accessToken)
        results.factions = await cachedUserFactions(event, accessToken)
        break
    }
  })

  if (!Array.isArray(promises) || promises.length === 0) {
    throw new Error('Unable to force a refresh because the keys are invalid')
  }

  await Promise.all(promises)

  return results as { [K in T[number]]: ForceRefreshReturnMap[K] }
}

function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex')
}

export const gtawClient = {
  fetchUserCharacters,
  fetchUserFactions,
  forceRefresh,
}
