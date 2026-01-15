import { z } from 'zod'
import {
  civilTitleSchema,
  districtSchema,
  firstnameSchema,
  genderSchema,
  lastnameSchema,
  maritalStatusSchema,
} from '@/validations/common.schema'
import {
  catholicOrOtherIds,
  householdRoleIds,
  individualSacramentIds,
} from '#shared/constants/person.constants'
import { parishesIds } from '@/constants/parishes.constants'
import { numberEnum } from '@/lib/utils'
import { getLocalEthnicsCommunitiesIds } from '#shared/constants/ethnicity.constants'

const preprocessedAge = (schema: any) => {
  return z.preprocess((val) => {
    if (val === '' || val === null || val === undefined) return undefined
    const num = Number(val)
    return Number.isNaN(num) ? undefined : num
  }, schema)
}

export const registerParishionerSchema = z.object({
  recordType: z.enum(['new', 'update']),
  civilTitle: civilTitleSchema,
  maritalStatus: maritalStatusSchema,
  firstname: firstnameSchema,
  lastname: lastnameSchema,
  gender: genderSchema,
  age: preprocessedAge(
    z
      .int({ error: "L'âge doit être un nombre entier." })
      .min(16, { error: "L'âge minimum pour s'enregistrer est de 16 ans." })
      .max(120, { error: "L'âge ne peut pas dépasser 120 ans." })
  ),
  ethnicCommunity: z.enum(getLocalEthnicsCommunitiesIds(), {
    error: 'Sélectionnez un choix valide.',
  }),
  occupation: z
    .string()
    .max(20, { error: "L'activité ne peut pas dépasser 200 caractères." })
    .optional(),
  phone: z.string().refine(
    (val) => {
      if (!val || val.trim() === '') return false
      const digitsOnly = val.replace(/\s/g, '')
      return /^\d{3,8}$/.test(digitsOnly)
    },
    { error: 'Le numéro de téléphone doit contenir entre 3 et 8 chiffres.' }
  ),
  emergencyPhone: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val || val.trim() === '') return true
        const digitsOnly = val.replace(/\s/g, '')
        return /^\d{3,8}$/.test(digitsOnly)
      },
      { error: "Le numéro de téléphone d'urgence doit contenir entre 3 et 8 chiffres." }
    ),
  address: z
    .string({
      error: (issue) =>
        issue.input === undefined ? "L'adresse ne peut pas être vide." : 'Valeur invalide',
    })
    .trim()
    .min(10, { error: "L'adresse doit contenir au minimum 10 caractères." })
    .max(60, { error: "L'adresse ne peut pas dépasser 60 caractères." }),
  district: districtSchema,
  baptized: z.enum(['yes', 'no', 'unsure'], { error: 'Veuillez sélectionner une réponse valide.' }),
  religion: z.enum(catholicOrOtherIds(), {
    error: 'Veuillez sélectionner une réponse valide.',
  }),
  parish: numberEnum(parishesIds(), {
    error: 'Veuillez sélectionner une paroisse valide.',
  }),
  familyMembers: z
    .array(
      z.object({
        firstname: firstnameSchema,
        lastname: lastnameSchema,
        age: z.coerce
          .number({ error: "L'âge doit être un nombre." })
          .int({ error: "L'âge doit être un nombre entier." })
          .min(0, { error: "L'âge ne peut pas être négatif." })
          .max(120, { error: "L'âge ne peut pas dépasser 120 ans." }),
        role: z.enum(householdRoleIds(), {
          error: (issue) =>
            issue.input === undefined
              ? 'Veuillez sélectionner un rôle pour ce membre du foyer'
              : 'Veuillez sélectionner un rôle valide',
        }),
        isNpc: z.boolean().default(false),
      })
    )
    .max(5, { error: 'Vous ne pouvez pas ajouter plus de 5 membres. (( Limite technique ))' })
    .optional(),
  message: z
    .string()
    .max(300, {
      error:
        "Pour des raisons techniques, le message ne doit pas faire plus de 300 caractères. Restez concis, et fournissez éventuellement les détails au clergé ou au personnel lors d'un rendez-vous.",
    })
    .optional(),

  characterSacraments: z
    .array(z.enum(individualSacramentIds(), { error: '(( Sélectionnez des sacrements valides ))' }))
    .default([])
    .optional(),
  oocAdditionalInformation: z
    .string()
    .max(700, { error: '(( Message trop long. Ne dépassez pas 700 caractères. ))' })
    .optional(),
})
