import type { GTAWCharacter, GTAWProfile } from '@gtaw-oauth-providers/better-auth'
import { createHash } from 'node:crypto'
import ky from 'ky'
import { defineCachedFunction } from 'nitro/cache'
import { env } from '#/config/env.server'
import type { GTAWClientFetchFactionsResponse } from '#/shared/types/gtaw-client.types'
import { logger } from '../integrations/logger'

const BASE_URL = env.GTAW_SERVER === 'fr' ? 'https://ucp-fr.gta.world' : 'https://ucp.gta.world'
const USER_AGENT = 'BetterAuth/1.0'

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

const fetchUserCharacters = defineCachedFunction(
  async (accessToken: string): Promise<GTAWCharacter[]> => {
    logger.debug('GTAW Client calling api/user...')
    const response = await client(accessToken).get('api/user').json<GTAWProfile>()
    return response.user.character
  },
  {
    maxAge: 60 * 5, // 5 minutes
    name: 'userCharactersFromAPI',
    getKey: (token: string) => hashToken(token),
  }
)

const fetchUserFactions = defineCachedFunction(
  async (accessToken: string): Promise<GTAWClientFetchFactionsResponse['data']> => {
    logger.debug('GTAW Client calling api/factions...')
    const response = await client(accessToken)
      .get('api/factions')
      .json<GTAWClientFetchFactionsResponse>()
    return response.data
  },
  {
    maxAge: 60 * 5, // 5 minutes
    name: 'userFactionsFromAPI',
    getKey: (token: string) => hashToken(token),
  }
)

export type ForceRefreshReturnMap = {
  characters: GTAWCharacter[]
  factions: GTAWClientFetchFactionsResponse['data']
}
export type ForceRefreshType = keyof ForceRefreshReturnMap

async function forceRefresh<T extends readonly ForceRefreshType[]>(
  accessToken: string,
  keys: T
): Promise<{ [K in T[number]]: ForceRefreshReturnMap[K] }> {
  const results: Partial<ForceRefreshReturnMap> = {}

  const promises = keys.map(async (type) => {
    switch (type) {
      case 'characters':
        // @ts-expect-error There is a known typing issue that has already been fixed in https://github.com/nitrojs/nitro/pull/4377. Wait for release.
        await fetchUserCharacters.invalidate(accessToken)
        logger.debug(`User characters cache invalidated for token %s`, accessToken)
        results.characters = await fetchUserCharacters(accessToken)
        break

      case 'factions':
        // @ts-expect-error There is a known typing issue that has already been fixed in https://github.com/nitrojs/nitro/pull/4377. Wait for release.
        await fetchUserFactions.invalidate(accessToken)
        logger.debug(`User factions cache invalidated for token %s`, accessToken)
        results.factions = await fetchUserFactions(accessToken)
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
