import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import type { Character, CurrentCharacter } from '#auth/types/character'
import { GTAWorldCharacter } from '@gtaw-oauth-providers/adonisjs-ally'
import app from '@adonisjs/core/services/app'
import type User from '#auth/models/user'

@inject()
export default class CharacterService {
  private readonly CURRENT_CHARACTER_SESSION_KEY = 'current_character'
  private readonly MAX_AGE = 24 * 60 * 60 * 1000

  constructor(protected ctx: HttpContext) {}

  private async getCharacterCacheService() {
    return await app.container.make('characterCache')
  }

  async getUserCharacters(): Promise<Character[] | undefined> {
    if (!this.ctx.auth.user) {
      throw new Error('No auth user found.')
    }

    const user = this.ctx.auth.user

    try {
      const characterCache = await this.getCharacterCacheService()

      return await characterCache.getCachedUserCharacters(user.id.toString(), () =>
        this.fetchCharactersFromAPI()
      )
    } catch (err) {
      this.ctx.logger.error(
        { err },
        `Failed to get characters for user '%s' (id: %d):`,
        user.name,
        user.id
      )
      throw err
    }
  }

  async setUserCharacters(user: User, characters: Character[]) {
    if (!user) {
      throw new Error('Cannot set user characters for undefined user.')
    }

    const characterCache = await this.getCharacterCacheService()

    characterCache.cacheCharacters(user.id.toString(), characters)
  }

  private async fetchCharactersFromAPI(): Promise<GTAWorldCharacter[]> {
    const user = this.ctx.auth.user!

    await user.loadOnce('accounts')

    const account = user!.accounts.find((ac) => ac.providerId === 'gtaw')

    if (!account) {
      await this.ctx.auth.use('web').logout()
      throw new Error('No account found.')
    }

    const accessToken = account!.getDecryptedAccessToken()

    if (!accessToken) {
      await this.ctx.auth.use('web').logout()
      throw new Error('No access token.')
    }

    const userFromApi = await this.ctx.ally.use('gtaw').userFromToken(accessToken)

    if (!userFromApi) {
      await this.ctx.auth.use('web').logout()
      throw new Error('Failed to fetch user from Oauth API.')
    }

    const isSameOwner =
      Number(account.accountId) === Number(userFromApi.original.character[0].memberid)

    if (!isSameOwner) {
      await this.ctx.auth.use('web').logout()
      const character = userFromApi.original.character[0]
      throw new Error(
        `User '${user.name}' (accountId: ${account.accountId}) is not the owner of the character '${character.firstname} ${character.lastname}' (memberid: ${character.memberid})`
      )
    }

    return userFromApi.original.character
  }

  async isCharacterOwnedByUser(characterId: number): Promise<boolean> {
    if (!this.ctx.auth.user) {
      return false
    }

    const userId = this.ctx.auth.user.id.toString()

    const characterCache = await this.getCharacterCacheService()

    return characterCache.isCharacterOwnedByUser(userId, characterId, () =>
      this.fetchCharactersFromAPI()
    )
  }

  setCurrentCharacter(character: Character) {
    const currentCharacter: CurrentCharacter = {
      id: character.id,
      data: character,
      selectedAt: Date.now(),
    }

    this.ctx.session.put(this.CURRENT_CHARACTER_SESSION_KEY, currentCharacter)

    this.ctx.logger.debug('Current character set for user', {
      userId: this.ctx.auth.user?.id,
      characterId: character.id,
      characterName: `${character.firstname} ${character.lastname}`,
    })
  }

  async getCurrentCharacter(): Promise<Character | null> {
    const currentCharater = this.ctx.session.get(
      this.CURRENT_CHARACTER_SESSION_KEY
    ) as CurrentCharacter | null

    if (!currentCharater) {
      return null
    }

    if (this.isStale(currentCharater.selectedAt)) {
      const characters = await this.getUserCharacters()

      if (!characters) {
        this.ctx.auth.use('web').logout()
        return null
      }

      const newCurrentCharacter = characters.at(0) as Character

      if (
        newCurrentCharacter.id !== currentCharater.id &&
        newCurrentCharacter.firstname !== currentCharater.data.firstname &&
        newCurrentCharacter.lastname !== currentCharater.data.lastname
      ) {
        this.setCurrentCharacter(newCurrentCharacter)
      }

      return newCurrentCharacter
    }

    return currentCharater.data
  }

  async updateCurrentCharacter(updatedCharacrer: Character) {
    const current = this.ctx.session.get(
      this.CURRENT_CHARACTER_SESSION_KEY
    ) as CurrentCharacter | null

    if (!current || current.id !== updatedCharacrer.id) {
      return false
    }

    const updated: CurrentCharacter = {
      id: updatedCharacrer.id,
      data: updatedCharacrer,
      selectedAt: Date.now(),
    }

    this.ctx.session.put(this.CURRENT_CHARACTER_SESSION_KEY, updated)

    if (this.ctx.auth.user) {
      const characterCache = await this.getCharacterCacheService()
      characterCache.invalidateUserCharacters(this.ctx.auth.user.id.toString())
    }

    return true
  }

  async clearCurrentCharacter() {
    this.ctx.session.forget(this.CURRENT_CHARACTER_SESSION_KEY)
    this.ctx.logger.debug(`Current character cleared for user ${this.ctx.auth.user?.id}`)

    if (this.ctx.auth.user) {
      const characterCache = await this.getCharacterCacheService()
      characterCache.invalidateUserCharacters(this.ctx.auth.user.id.toString())
    }
  }

  async isCurrentCharacter(characterId: number) {
    const current = await this.getCurrentCharacter()
    return current?.id === characterId
  }

  private isStale(timestamp: number): boolean {
    return Date.now() - timestamp > this.MAX_AGE
  }

  async invalidateCache() {
    if (this.ctx.auth.user) {
      const characterCache = await this.getCharacterCacheService()
      characterCache.invalidateUserCharacters(this.ctx.auth.user.id.toString())
    }
  }

  async getCacheStats() {
    const characterCache = await this.getCharacterCacheService()
    return characterCache.getStats()
  }
}
