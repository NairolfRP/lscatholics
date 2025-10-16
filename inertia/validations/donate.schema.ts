import { z } from 'zod'
import {
  districtSchema,
  ethnicitySchema,
  firstnameSchema,
  lastnameSchema,
} from '@/validations/common.schema'

export const donateSchema = z.object({
  amount: z
    .int({
      error: (issue) =>
        issue.input === undefined
          ? 'Le montant du don est requis.'
          : 'Le montant doit être un nombre entier valide.',
    })
    .min(200, { error: 'Le montant minimum pour un don est de $200.' }),
  firstname: firstnameSchema,
  lastname: lastnameSchema,
  age: z
    .int({ error: "L'âge doit être un nombre entier." })
    .min(16, { error: "L'âge minimum pour faire un don est de 16 ans." })
    .max(120, { error: "L'âge ne peut pas dépasser 120 ans." })
    .optional()
    .or(z.literal(0).transform(() => undefined)),
  ethnicity: ethnicitySchema.optional(),
  phone: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val || val.trim() === '') return true
        const digitsOnly = val.replace(/\s/g, '')
        return /^\d{3,8}$/.test(digitsOnly)
      },
      { error: 'Le numéro de téléphone doit contenir entre 3 et 8 chiffres.' }
    ),
  address: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val || val.trim() === '') return true
        const trimmed = val.trim()
        return trimmed.length >= 10
      },
      {
        error: "L'adresse doit contenir au minimum 10 caractères.",
      }
    ),
  district: districtSchema.optional(),
  isOrganization: z.boolean(),
  organizationName: z.string().optional(),
  anonymous: z.boolean(),
  fleecaConfirmation: z
    .boolean({ error: '(( Vous devez accepter cette case. ))' })
    .refine((val) => val, {
      error: '(( Vous devez cocher la confirmation pour continuer. ))',
    }),
})
