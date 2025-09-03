import type { HttpContext } from '@adonisjs/core/http'

export default class FindsController {
  parishes({ inertia }: HttpContext) {
    return inertia.render('find/parishes')
  }
}
