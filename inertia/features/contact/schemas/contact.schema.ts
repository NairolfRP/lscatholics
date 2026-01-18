import { z } from 'zod'
import { contactSubjectsIds } from '#shared/constants/contact_subjects'

export const contactSchema = z.object({
  firstname: z
    .string()
    .min(2, {
      error: 'Vous devez indiquer un prénom valide.',
    })
    .max(50, { error: 'Le prénom ne doit pas dépasser 50 caractères.' }),
  lastname: z
    .string()
    .min(2, {
      error: 'Vous devez indiquer un nom de famille valide',
    })
    .max(50, { error: 'Le nom de famille ne doit pas dépasser 50 caractères.' }),
  phone: z
    .string()
    .trim()
    .regex(/^(?=(?: *\d){3,8} *$)[\d ]+$/, {
      error: 'Vous devez indiquer un numéro de téléphone valide.',
    })
    .transform((v) => Number(v.replace(/\s/g, ''))),
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
