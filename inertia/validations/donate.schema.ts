import { z } from 'zod'
import { getEthnicsGroupsIds } from '#shared/constants/ethnicity.constants'
import { getDistrictIds } from '#shared/constants/districts.constants'

export const donateSchema = z.object({
  amount: z
    .int({
      error: (issue) =>
        issue.input === undefined
          ? 'Le montant du don est requis.'
          : 'Le montant doit être un nombre entier valide.',
    })
    .min(200, { error: 'Le montant minimum pour un don est de $200.' }),
  firstname: z
    .string({
      error: (issue) => (issue.input === undefined ? 'Le prénom est requis.' : 'Valeur invalide.'),
    })
    .trim()
    .min(1, { error: 'Le prénom ne peut pas être vide.' })
    .max(50, 'Le prénom ne peut pas dépasser 50 caractères.'),
  lastname: z
    .string({
      error: (issue) =>
        issue.input === undefined ? 'Le nom de famille est requis.' : 'Valeur invalide.',
    })
    .trim()
    .min(1, { error: 'Le nom de famille ne peut pas être vide.' })
    .max(50, 'Le nom de famille ne peut pas dépasser 50 caractères.'),
  age: z
    .int({ error: "L'âge doit être un nombre entier." })
    .min(16, { error: "L'âge minimum pour faire un don est de 16 ans." })
    .max(120, { error: "L'âge ne peut pas dépasser 120 ans." })
    .optional()
    .or(z.literal(0).transform(() => undefined)),
  ethnicity: z
    .enum(getEthnicsGroupsIds(), { error: 'Veuillez sélectionner un groupe ethnique valide.' })
    .optional(),
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
  district: z
    .enum(getDistrictIds(), { error: 'Veuillez sélectionner un district valide.' })
    .optional(),
  isOrganization: z.boolean(),
  organizationName: z.string().optional(),
  anonymous: z.boolean(),
  fleecaConfirmation: z
    .boolean({ error: '(( Vous devez accepter cette case. ))' })
    .refine((val) => val, {
      error: '(( Vous devez cocher la confirmation pour continuer. ))',
    }),
})
