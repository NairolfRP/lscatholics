import { inject } from '@adonisjs/core'
// oxlint-disable-next-line typescript/consistent-type-imports
import { HttpContext } from '@adonisjs/core/http'
import type { CharacterFaction, CharacterFactionsResponse } from '#characters/types/faction'
import app from '@adonisjs/core/services/app'
import { FactionCacheService } from '#characters/services/faction_cache_service'
import ky, { isHTTPError } from 'ky'

@inject()
export class FactionService {
  readonly #BASE_URL = 'https://ucp-fr.gta.world'

  constructor(protected ctx: HttpContext) {}

  async getCharacterFactions(characterId: number): Promise<CharacterFaction | null> {
    try {
      const allFactions = await this.getAllUserFactions()
      return allFactions.find((c) => c.characterId === characterId) || null
    } catch (e) {
      this.ctx.logger.error({ err: e }, 'Failed to get character factions')
      throw e
    }
  }

  async getAllUserFactions(forceRefresh = false): Promise<CharacterFaction[]> {
    if (!this.ctx.auth.user) {
      throw new Error('No authenticated user found')
    }

    const userId = this.ctx.auth.user.id.toString()

    try {
      const factionCache = await this.#getFactionCacheService()

      if (forceRefresh) {
        return await factionCache.forceRefresh(userId, () => this.#fetchFactionsFromAPI())
      }

      return await factionCache.getCachedUserFactions(userId, () => this.#fetchFactionsFromAPI())
    } catch (error) {
      this.ctx.logger.error({ err: error }, `Failed to get factions for user ${userId}`)
      throw error
    }
  }

  async characterHasFaction(characterId: number, factionId: number): Promise<boolean> {
    const faction = await this.#getCharacterFactionsForSecurity(characterId)
    return faction?.factionId === factionId
  }

  async characterHasMinRank(
    characterId: number,
    factionId: number,
    minRank: number
  ): Promise<boolean> {
    const faction = await this.#getCharacterFactionsForSecurity(characterId)

    if (!faction || faction.factionId !== factionId) {
      return false
    }

    return faction.factionRank >= minRank
  }

  async getCharacterRank(characterId: number): Promise<{
    rank: number
    rankName: string
  } | null> {
    const faction = await this.getCharacterFactions(characterId)

    if (!faction) {
      return null
    }

    return {
      rank: faction.factionRank,
      rankName: faction.factionRankName,
    }
  }

  async refreshFactions(): Promise<CharacterFaction[]> {
    return this.getAllUserFactions(true)
  }

  async invalidateCache(): Promise<void> {
    if (this.ctx.auth.user) {
      const factionCache = await this.#getFactionCacheService()
      factionCache.invalidateUserFactions(this.ctx.auth.user.id.toString())
    }
  }

  /*async isCurrentCharacterAdmin(): Promise<boolean> {
  const currentCharacter = await this.ctx.characters.getCurrentCharacter()

  if (!currentCharacter) {
    return false
  }

  const faction = await this.#getCharacterFactionsForSecurity(currentCharacter.id)

  return faction ? this.isAdminFaction(faction.factionId) : false
}*/

  async isCacheValid(): Promise<boolean> {
    if (!this.ctx.auth.user) {
      return false
    }

    const factionCache = await this.#getFactionCacheService()
    return factionCache.isCacheValid(this.ctx.auth.user.id.toString())
  }

  async getCacheStats() {
    const factionCache = await this.#getFactionCacheService()
    return factionCache.getStats()
  }

  async #getFactionCacheService() {
    return await app.container.make(FactionCacheService)
  }

  async #getCharacterFactionsForSecurity(characterId: number): Promise<CharacterFaction | null> {
    if (!this.ctx.auth.user) {
      return null
    }

    const userId = this.ctx.auth.user.id.toString()
    const factionCache = await this.#getFactionCacheService()

    const allFactions = await factionCache.getCachedUserFactions(userId, () =>
      this.#fetchFactionsFromAPI()
    )

    return allFactions.find((f) => f.characterId === characterId) || null
  }

  async #fetchFactionsFromAPI(): Promise<CharacterFaction[]> {
    const user = this.ctx.auth.user!

    await user.loadOnce('accounts')

    const account = user.accounts.find((ac) => ac.providerId === 'gtaw')

    if (!account) {
      await this.ctx.auth.use('web').logout()
      throw new Error('No GTAW account found')
    }

    const accessToken = account.getDecryptedAccessToken()

    if (!accessToken) {
      await this.ctx.auth.use('web').logout()
      throw new Error('No access token available')
    }

    try {
      const response = await ky
        .get(`${this.#BASE_URL}/api/factions`, {
          retry: {
            limit: 3,
          },
          signal: AbortSignal.timeout(5_000),
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: 'application/json',
          },
        })
        .json<{
          requestId: string
          data: CharacterFactionsResponse
        }>()

      return this.#remapAPIResponse(response.data)
    } catch (error) {
      if (isHTTPError(error)) {
        throw new Error(
          `Failed to fetch factions: ${error.response.status} ${error.response.statusText}`
        )
      }
      throw error
    }
  }

  #remapAPIResponse(response: CharacterFactionsResponse): CharacterFaction[] {
    const newData: CharacterFaction[] = []
    for (const [key, value] of Object.entries(response)) {
      newData.push({
        characterId: Number(key),
        factionId: value.faction,
        factionName: value.faction_name,
        factionRank: value.faction_rank,
        factionRankName: value.faction_rank_name,
      })
    }
    return newData
  }
}
