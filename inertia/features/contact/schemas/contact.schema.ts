import { z } from 'zod'
import { contactSubjectsIds } from '#shared/constants/contact_subjects'
import { firstnameSchema, lastnameSchema, phoneSchema } from '@/shared/schemas/common.schema'

export const contactSchema = z.object({
  firstname: firstnameSchema,
  lastname: lastnameSchema,
  phone: phoneSchema,
  subject: z.enum(contactSubjectsIds, {
    error: (issue) =>
      issue.input === undefined
        ? 'Vous devez sélectionner un sujet'
        : 'Veuillez sélectionner un sujet valide',
  }),
  message: z
    .string()
    .min(3, { error: 'Votre message est trop court (3 caractères minimum)' })
    .max(2000, { error: 'Votre message est trop long (2000 caractères maximum)' }),
})
