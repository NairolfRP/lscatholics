import vine from '@vinejs/vine'
import { SERVICES } from '#shared/constants/services.constants'

export const createServiceSlugValidator = vine.compile(
  vine.object({
    params: vine.object({
      slug: vine.enum(SERVICES.map((s) => s.slug)),
    }),
  })
)
