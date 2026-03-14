import vine from '@vinejs/vine'
import { CHURCH_SERVICES_META } from '#shared/constants/church_services.constants'

export const createServiceSlugValidator = vine.create(
  vine.object({
    params: vine.object({
      slug: vine.enum(CHURCH_SERVICES_META.map((s) => s.slug)),
    }),
  })
)
