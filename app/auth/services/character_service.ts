import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import type { Character, CurrentCharacter } from '#auth/types/character'

@inject()
export default class CharacterService {
  private readonly CURRENT_CHARACTER_SESSION_KEY = 'current_character'
  private readonly MAX_AGE = 24 * 60 * 60 * 1000

  constructor(protected ctx: HttpContext) {}

  async getUserCharacters(): Promise<Character[] | undefined> {
    if (!this.ctx.auth.user) {
      throw new Error('No auth user found.')
    }

    const user = this.ctx.auth.user

    try {
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

      const isSameOwner = account.accountId === userFromApi.original.character.at(0).memberid

      if (!isSameOwner) {
        await this.ctx.auth.use('web').logout()
        throw new Error('')
      }

      return userFromApi.original.character
    } catch (error) {
      this.ctx.logger.error(`Failed to get characters for user '${user.name}' (id: ${user.id}):`, {
        error,
      })
      throw error
    }
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

  updateCurrentCharacter(updatedCharacrer: Character) {
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
    return true
  }

  clearCurrentCharacter() {
    this.ctx.session.forget(this.CURRENT_CHARACTER_SESSION_KEY)
    this.ctx.logger.debug(`Current character cleared for user ${this.ctx.auth.user?.id}`)
  }

  async isCurrentCharacter(characterId: number) {
    const current = await this.getCurrentCharacter()
    return current?.id === characterId
  }

  private isStale(timestamp: number): boolean {
    return Date.now() - timestamp > this.MAX_AGE
  }
}
