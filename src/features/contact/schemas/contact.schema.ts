import { z } from 'zod'
import { CONTACT_SUBJECT_VALUES } from '#/features/contact/constants/contact-subjects.ts'

export const contactSchema = z.object({
  firstName: z
    .string({ error: 'Le prénom est requis.' })
    .trim()
    .min(2, { error: (iss) => `Le prénom doit comporter au moins ${iss.minimum} caractères.` })
    .max(50, { error: (iss) => `Le prénom ne doit pas dépasser ${iss.maximum} caractères.` }),
  lastName: z
    .string({ error: 'Le nom de famille est requis.' })
    .trim()
    .min(2, { error: (iss) => `Le nom doit comporter au moins ${iss.minimum} caractères.` })
    .max(50, { error: (iss) => `Le nom ne doit pas dépasser ${iss.maximum} caractères.` }),
  phone: z
    .string({ error: 'Le numéro de téléphone est requis.' })
    .trim()
    .min(3, { error: (iss) => `Le numéro doit comporter au moins ${iss.minimum} chiffres.` })
    .max(15, { error: (iss) => `Le numéro ne doit pas dépasser ${iss.maximum} chiffres.` })
    .regex(/^\+?[\d\s.-]+$/, { error: 'Entrez un numéro de téléphone valide.' }),
  subject: z.enum(CONTACT_SUBJECT_VALUES, {
    error: (iss) =>
      iss.input === undefined ? 'Le sujet est requis.' : 'Ce sujet est invalide ou n’existe plus.',
  }),
  message: z
    .string({ error: 'Le message est requis.' })
    .trim()
    .min(10, {
      error: (iss) => `Le message doit comporter au moins ${iss.minimum} caractères.`,
    })
    .max(2000, {
      error: (iss) => `Le message ne doit pas dépasser ${iss.maximum} caractères.`,
    }),
})

export type ContactFormInput = z.input<typeof contactSchema>
