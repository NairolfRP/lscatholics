import type { HttpContext } from '@adonisjs/core/http'

export default class CharactersController {
  async listCharacters({ characters, response }: HttpContext) {
    try {
      const data = await characters.getUserCharacters()

      if (!data) {
        return response.status(500).json({
          error: 'Failed to list user characters',
          success: false,
        })
      }

      return response.json({
        data,
        success: true,
      })
    } catch {
      return response.internalServerError({
        error: 'Failed to fetch characters',
        success: false,
      })
    }
  }

  async switchCharacter({ request, response, session, characters }: HttpContext) {
    try {
      const { characterId } = request.only(['characterId'])

      const isOwned = await characters.isCharacterOwnedByUser(Number(characterId))
      if (!isOwned) {
        session.flashErrors({
          E_SWITCH_CHARACTER: 'Ce personnage ne vous appartient pas',
        })
        return response.redirect().back()
      }

      const charactersList = await characters.getUserCharacters()
      const character = charactersList?.find((c) => c.id === Number(characterId))

      if (!character) {
        session.flashErrors({
          E_SWITCH_CHARACTER: 'Personnage introuvable',
        })
        return response.redirect().back()
      }

      characters.setCurrentCharacter(character)

      session.flash(
        'success',
        `(( Nouveau personnage actuel : ${character.firstname} ${character.lastname} ))`
      )

      return response.redirect().back()
    } catch {
      session.flashErrors({
        E_SWITCH_CHARACTER: 'Une erreur est survenue lors du changement de personnage',
      })
      return response.redirect().back()
    }
  }
}
