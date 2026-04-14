import type { HttpContext } from '@adonisjs/core/http'

export default class CharactersController {
  async index({ characters: charactersService, response, logger }: HttpContext) {
    try {
      const characters = await charactersService.getUserCharacters()

      if (!characters) {
        return response.internalServerError({
          message: 'Failed to list user characters',
          success: false,
        })
      }

      return response.json({
        characters,
        success: true,
      })
    } catch (err) {
      logger.error({ err }, 'Failed to fetch characters')
      return response.internalServerError({
        message: 'Failed to fetch characters',
        success: false,
      })
    }
  }

  async updateCurrent({ request, response, session, characters }: HttpContext) {
    try {
      const { id } = request.only(['id'])

      const isOwned = await characters.isCharacterOwnedByUser(Number(id))
      if (!isOwned) {
        session.flash('error', 'Ce personnage ne vous appartient pas')
        return response.redirect().back()
      }

      const charactersList = await characters.getUserCharacters()
      const character = charactersList?.find((c) => c.id === Number(id))

      if (!character) {
        session.flash('error', 'Personnage introuvable')
        return response.redirect().back()
      }

      characters.setCurrentCharacter(character)

      session.flash(
        'success',
        `(( Nouveau personnage actuel : ${character.firstname} ${character.lastname} ))`
      )

      return response.redirect().back()
    } catch {
      session.flash('error', 'Une erreur est survenue lors du changement de personnage')
      return response.redirect().back()
    }
  }
}
