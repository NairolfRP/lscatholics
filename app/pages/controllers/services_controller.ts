import type { HttpContext } from '@adonisjs/core/http'
import { createServiceSlugValidator } from '#pages/validators/service_slug'

export default class ServicesController {
  index({ inertia }: HttpContext) {
    return inertia.render('services/all')
  }

  async single({ inertia, request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(createServiceSlugValidator)

      return inertia.render(`services/${payload.params.slug}`)
    } catch {
      return response.redirect().toRoute('services.index')
    }
  }
}
