import { z } from 'zod'
import { CONTACT_SUBJECT_VALUES } from '#/features/contact/constants/contact-subjects.ts'
import { optionalEyefindMailSchema } from '#shared/schemas/utils.schema.ts'

const optionalPhoneSchema = z
  .string()
  .trim()
  .max(15, { error: (iss) => `Le numéro ne doit pas dépasser ${iss.maximum} chiffres.` })
  .optional()
  .transform((value) => (value ? value : undefined))
  .pipe(
    z.union([
      z.undefined(),
      z
        .string()
        .min(3, { error: (iss) => `Le numéro doit comporter au moins ${iss.minimum} chiffres.` })
        .regex(/^\+?[\d\s.-]+$/, { error: 'Entrez un numéro de téléphone valide.' }),
    ])
  )

export const contactSchema = z
  .object({
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
    phone: optionalPhoneSchema,
    eyefindMail: optionalEyefindMailSchema,
    subject: z.enum(CONTACT_SUBJECT_VALUES, {
      error: (iss) =>
        iss.input === undefined
          ? 'Le sujet est requis.'
          : 'Ce sujet est invalide ou n’existe plus.',
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
  .superRefine((data, ctx) => {
    if (!data.phone && !data.eyefindMail) {
      ctx.addIssue({
        code: 'custom',
        message: 'Indiquez un numéro de téléphone ou une adresse EyefindMail.',
        path: ['phone'],
      })
    }
  })

export type ContactFormInput = z.input<typeof contactSchema>
export type ContactFormOutput = z.output<typeof contactSchema>
