import type { HttpContext } from '@adonisjs/core/http'
import { Exception } from '@adonisjs/core/exceptions'

export default class CharitiesController {
  protected readonly programs = [
    'food-aid',
    'emergency-relief',
    'housing-assistance',
    'adoption-services',
    'immigration-support',
    'addiction-treatment',
    'education-support',
  ] as const

  index({ inertia }: HttpContext) {
    return inertia.render('charities/index', {})
  }

  showProgram({ params, inertia }: HttpContext) {
    const { slug } = params as {
      slug: (typeof CharitiesController.prototype.programs)[number]
    }

    if (!this.programs.includes(slug)) {
      throw new Exception('Program not fround', { status: 404 })
    }

    return inertia.render(`charities/programs/show`, { slug })
  }
}
