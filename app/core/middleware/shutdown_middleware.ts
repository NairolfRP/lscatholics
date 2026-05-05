import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class ShutdownMiddleware {
  async handle({ request, response, view }: HttpContext, _next: NextFn) {
    if (request.accepts(['json', 'html']) === 'json') {
      return response.status(503).json({ message: 'Ce service est définitivement fermé.' })
    }

    return response.status(503).send(await view.render('shutdown'))
  }
}
