import type { HttpContext } from '@adonisjs/core/http'
import { Exception } from '@adonisjs/core/exceptions'
import { inject } from '@adonisjs/core'
import DecreesService from '#pages/services/decrees_service'

@inject()
export default class DecreesController {
  constructor(protected service: DecreesService) {}

  async index({ inertia }: HttpContext) {
    return inertia.render('decrees/index', {
      decrees: inertia.defer(async () => {
        const decrees = await this.service.getDecrees()
        return this.service.sortDecreesByCategories(decrees)
      }),
    })
  }

  async single({ params, inertia, response }: HttpContext) {
    const { threadId, slug } = params.uid as { threadId: string; slug: string }

    const data = await this.service.getSingleDecree(threadId)

    if (!data) {
      throw new Exception('Decree not found', { status: 404 })
    }

    const { decree, metadata } = data

    if (slug !== decree.slug) {
      return response
        .redirect()
        .status(301)
        .toRoute('decrees.single', { uid: `${threadId}-${decree.slug}` })
    }

    return inertia.render('decrees/single', { decree, metadata })
  }
}
