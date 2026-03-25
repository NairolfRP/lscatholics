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

  async single({ params, inertia }: HttpContext) {
    const { threadId } = params.uid as { threadId: string; slug: string }
    const decree = await this.service.getSingleDecree(threadId)

    if (!decree) {
      throw new Exception('Decree not found', { status: 404 })
    }

    const decreeEmbed = decree[0].embeds[0]

    return inertia.render('decrees/single', {
      title: decreeEmbed.title!,
      description: decreeEmbed.description!,
      timestamp: decreeEmbed.timestamp,
      image: decreeEmbed.image?.url,
      fields: decreeEmbed.fields ?? [],
    })
  }
}
