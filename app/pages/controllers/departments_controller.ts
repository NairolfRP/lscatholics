import type { HttpContext } from '@adonisjs/core/http'
import { Exception } from '@adonisjs/core/exceptions'

export default class DepartmentsController {
  private allowedDepartments = [
    'office-of-the-archbishop',
    'moderator-of-the-curia',
    'chancellor',
    'safety',
    'communications',
    'general-services',
    'human-resources',
    'financial-services',
    'general-counsel',
    'catholic-charities',
  ]

  index({ inertia }: HttpContext) {
    return inertia.render('departments/index', {})
  }

  single({ inertia, params }: HttpContext) {
    const slug = params.slug as string

    if (!this.allowedDepartments.includes(slug)) {
      throw new Exception('Not found', { status: 404 })
    }

    return inertia.render('departments/single', {
      departmentSlug: slug,
    })
  }
}
