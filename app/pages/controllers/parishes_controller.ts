import type { HttpContext } from '@adonisjs/core/http'

export default class ParishesController {
  parishes({ inertia }: HttpContext) {
    return inertia.render('parishes', {})
  }
}
