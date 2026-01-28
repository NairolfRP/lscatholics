import type { HttpContext } from '@adonisjs/core/http'

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
    return inertia.render('departments/all')
  }

  single({ response, inertia, params }: HttpContext) {
    const slug = params.slug as string

    if (!this.allowedDepartments.includes(slug)) {
      response.redirect().toRoute('departments.index')
    }

    return inertia.render('departments/single', {
      departmentSlug: slug,
    })
  }
}
