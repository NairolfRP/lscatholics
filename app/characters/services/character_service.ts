import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import type { Character, CharacterFromApi, CurrentCharacter } from '#characters/types/character'
import app from '@adonisjs/core/services/app'
import type User from '#users/models/user'
import { createCharacterSessionValidator } from '#characters/validators/character'
import { CharacterCacheService } from '#characters/services/character_cache_service'

@inject()
export default class CharacterService {
  readonly #CURRENT_CHARACTER_SESSION_KEY = 'current_character'
  readonly #MAX_AGE = 24 * 60 * 60 * 1000

  constructor(protected ctx: HttpContext) {}

  async #getCharacterCacheService() {
    return await app.container.make(CharacterCacheService)
  }

  async getUserCharacters(): Promise<Character[] | undefined> {
    if (!this.ctx.auth.user) {
      throw new Error('No auth user found.')
    }

    const user = this.ctx.auth.user

    try {
      const characterCache = await this.#getCharacterCacheService()

      const characters = await characterCache.getCachedUserCharacters(user.id.toString(), () =>
        this.#fetchCharactersFromAPI()
      )

      return characters.map((c) => this.#remapCharacterObject(c))
    } catch (error) {
      this.ctx.logger.error(
        { err: error },
        `Failed to get characters for user '%s' (id: %d):`,
        user.name,
        user.id
      )
      throw error
    }
  }

  async setUserCharacters(user: User, characters: Character[]) {
    if (!user) {
      throw new Error('Cannot set user characters for undefined user.')
    }

    const characterCache = await this.#getCharacterCacheService()

    characterCache.cacheCharacters(user.id.toString(), characters)
  }

  async #fetchCharactersFromAPI(): Promise<Character[]> {
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

    const userFromApi = await Promise.race([
      this.ctx.ally.use('gtaw').userFromToken(accessToken),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('GTAW Ally userFromToken timed out after 5s')), 5_000)
      ),
    ])

    if (!userFromApi) {
      await this.ctx.auth.use('web').logout()
      throw new Error('Failed to fetch user from Oauth API.')
    }

    if (!userFromApi.original.character || userFromApi.original.character.length === 0) {
      await this.ctx.auth.use('web').logout()
      throw new Error('No characters found on GTA World account.')
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

    return (userFromApi.original.character as CharacterFromApi[]).map((c) =>
      this.#remapCharacterObject(c)
    )
  }

  #remapCharacterObject(character: CharacterFromApi | Character) {
    if ('bank_routing_number' in character) {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const { bank_routing_number, ...other } = character
      return {
        ...other,
        bankRoutingNumber: bank_routing_number,
      }
    }

    return character
  }

  async isCharacterOwnedByUser(characterId: number): Promise<boolean> {
    if (!this.ctx.auth.user) {
      return false
    }

    const userId = this.ctx.auth.user.id.toString()

    const characterCache = await this.#getCharacterCacheService()

    return characterCache.isCharacterOwnedByUser(userId, characterId, () =>
      this.#fetchCharactersFromAPI()
    )
  }

  setCurrentCharacter(
    character: Character | (Omit<Character, 'bank_routing_number'> & { bankRoutingNumber: string })
  ) {
    const currentCharacter: CurrentCharacter = {
      id: character.id,
      data: this.#remapCharacterObject(character),
      selectedAt: Date.now(),
    }

    this.ctx.session.put(this.#CURRENT_CHARACTER_SESSION_KEY, currentCharacter)

    this.ctx.logger.debug('Current character set for user id %d: %o', this.ctx.auth.user?.id, {
      characterId: character.id,
      characterName: `${character.firstname} ${character.lastname}`,
    })
  }

  async getCurrentCharacter(): Promise<Character | null> {
    const raw = this.ctx.session.get(this.#CURRENT_CHARACTER_SESSION_KEY)

    try {
      const currentCharacter = await createCharacterSessionValidator.validate(raw)

      if (this.isStale(currentCharacter.selectedAt)) {
        const characters = await this.getUserCharacters()

        if (!characters || characters.length === 0) {
          await this.ctx.auth.use('web').logout()
          return null
        }

        const reselectedCharacter = characters.find((c) => c.id === currentCharacter.id)

        if (!reselectedCharacter) {
          const newCurrentCharacter = this.#remapCharacterObject(characters[0])

          this.setCurrentCharacter(newCurrentCharacter)

          return newCurrentCharacter
        }

        if (
          reselectedCharacter.firstname !== currentCharacter.data.firstname ||
          reselectedCharacter.lastname !== currentCharacter.data.lastname
        ) {
          this.setCurrentCharacter(reselectedCharacter)
        }

        return this.#remapCharacterObject(reselectedCharacter)
      }

      return this.#remapCharacterObject(currentCharacter.data)
    } catch (err) {
      this.ctx.logger.warn({ err }, 'Invalid session character data, clearing')
      this.ctx.session.forget(this.#CURRENT_CHARACTER_SESSION_KEY)
      await this.ctx.auth.use('web').logout()
      return null
    }
  }

  async updateCurrentCharacter(updatedCharacter: Character | CharacterFromApi) {
    const current = this.ctx.session.get(
      this.#CURRENT_CHARACTER_SESSION_KEY
    ) as CurrentCharacter | null

    if (!current || current.id !== updatedCharacter.id) {
      return false
    }

    const updated: CurrentCharacter = {
      id: updatedCharacter.id,
      data: this.#remapCharacterObject(updatedCharacter),
      selectedAt: Date.now(),
    }

    this.ctx.session.put(this.#CURRENT_CHARACTER_SESSION_KEY, updated)

    if (this.ctx.auth.user) {
      const characterCache = await this.#getCharacterCacheService()
      characterCache.invalidateUserCharacters(this.ctx.auth.user.id.toString())
    }

    return true
  }

  async clearCurrentCharacter() {
    this.ctx.session.forget(this.#CURRENT_CHARACTER_SESSION_KEY)
    this.ctx.logger.debug(`Current character cleared for user %d`, this.ctx.auth.user?.id)

    if (this.ctx.auth.user) {
      const characterCache = await this.#getCharacterCacheService()
      characterCache.invalidateUserCharacters(this.ctx.auth.user.id.toString())
    }
  }

  async isCurrentCharacter(characterId: number) {
    const current = await this.getCurrentCharacter()
    return current?.id === characterId
  }

  private isStale(timestamp: number): boolean {
    return Date.now() - timestamp > this.#MAX_AGE
  }

  async invalidateCache() {
    if (this.ctx.auth.user) {
      const characterCache = await this.#getCharacterCacheService()
      characterCache.invalidateUserCharacters(this.ctx.auth.user.id.toString())
    }
  }

  async getCacheStats() {
    const characterCache = await this.#getCharacterCacheService()
    return characterCache.getStats()
  }
}
