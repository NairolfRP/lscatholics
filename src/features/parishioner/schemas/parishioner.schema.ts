import { z } from 'zod'
import {
  BAPTIZED_VALUES,
  CIVIL_TITLE_VALUES,
  ETHNIC_COMMUNITY_VALUES,
  GENDER_VALUES,
  getSacramentPrerequisites,
  HOUSEHOLD_ROLE_VALUES,
  INDIVIDUAL_SACRAMENT_VALUES,
  MARITAL_STATUS_VALUES,
  RELIGION_VALUES,
} from '#/features/parishioner/constants/person.constants.ts'
import { DISTRICT_VALUES } from '#shared/constants/districts.constants.ts'
import { PARISH_VALUES } from '#shared/constants/parish.ts'
import { addressSchema, districtSchema } from '#shared/schemas/location.schema.ts'
import { ageSchema, nameSchema } from '#shared/schemas/person.schema.ts'
import { phoneSchema } from '#shared/schemas/phone.schema.ts'
import { optionalEnumSchema } from '#shared/schemas/utils.schema'

export const PARISHIONER_PARISH_UNSURE_VALUE = 'unsure'

const familyMemberSchema = z.object({
  firstname: nameSchema('prénom'),
  lastname: nameSchema('nom'),
  age: ageSchema({ requiredMessage: "Veuillez saisir l'âge de ce membre du foyer.", min: 0 }),
  role: z.enum(HOUSEHOLD_ROLE_VALUES, {
    error: (iss) =>
      iss.input === undefined
        ? 'Veuillez sélectionner un rôle pour ce membre du foyer.'
        : 'Veuillez sélectionner un rôle valide.',
  }),
  isNpc: z.boolean().default(false),
})

export const parishionerSchema = z.object({
  civilTitle: z.enum(CIVIL_TITLE_VALUES, {
    error: (iss) =>
      iss.input === undefined ? 'Le titre de civilité est requis.' : 'Titre de civilité invalide.',
  }),
  maritalStatus: z.enum(MARITAL_STATUS_VALUES, {
    error: (iss) =>
      iss.input === undefined
        ? "L'état matrimonial est requis."
        : "L'état matrimonial est invalide.",
  }),
  firstname: nameSchema('prénom'),
  lastname: nameSchema('nom'),
  gender: z.enum(GENDER_VALUES, {
    error: (iss) => (iss.input === undefined ? 'Le sexe est requis.' : 'Le sexe est invalide.'),
  }),
  age: ageSchema({ requiredMessage: 'Veuillez saisir votre âge.', min: 18 }),
  ethnicCommunity: optionalEnumSchema(ETHNIC_COMMUNITY_VALUES),
  occupation: z
    .string()
    .trim()
    .max(20, { error: (iss) => `L'activité ne peut pas dépasser ${iss.maximum} caractères.` })
    .optional(),
  phone: phoneSchema,
  emergencyPhone: z
    .union([phoneSchema, z.literal('')])
    .optional()
    .transform((value) => (value ? value : undefined)),
  address: addressSchema(60),
  district: districtSchema(DISTRICT_VALUES, 'quartier'),
  baptized: z.enum(BAPTIZED_VALUES, {
    error: (iss) =>
      iss.input === undefined ? 'Veuillez indiquer si vous êtes baptisé.' : 'Réponse invalide.',
  }),
  religion: optionalEnumSchema(RELIGION_VALUES),
  parish: z
    .union([
      z.enum(PARISH_VALUES, { error: 'Paroisse invalide.' }),
      z.literal(PARISHIONER_PARISH_UNSURE_VALUE),
    ])
    .optional()
    .transform((value) => (value ? value : undefined)),
  isVolunteer: z.boolean().default(false),
  familyMembers: z
    .array(familyMemberSchema)
    .max(5, { error: 'Vous ne pouvez pas ajouter plus de 5 membres du foyer.' })
    .default([]),
  message: z
    .string()
    .trim()
    .max(300, {
      error:
        'Pour des raisons techniques, le message ne doit pas faire plus de 300 caractères. Restez concis, et fournissez éventuellement les détails au clergé lors d’un rendez-vous.',
    })
    .optional(),
  characterSacraments: z
    .array(z.enum(INDIVIDUAL_SACRAMENT_VALUES, { error: 'Sélectionnez des sacrements valides.' }))
    .superRefine((sacraments, ctx) => {
      for (const sacrament of sacraments) {
        const missingPrerequisites = getSacramentPrerequisites(sacrament).filter(
          (prerequisite) => !sacraments.includes(prerequisite as never)
        )

        if (missingPrerequisites.length > 0) {
          ctx.addIssue({
            code: 'custom',
            message: `Le sacrement « ${sacrament} » suppose d'avoir d'abord reçu d'autres sacrements. Vérifiez votre sélection.`,
          })
          return
        }
      }
    })
    .default([]),
  oocAdditionalInformation: z
    .string()
    .trim()
    .max(700, { error: (iss) => `Message trop long. Ne dépassez pas ${iss.maximum} caractères.` })
    .optional(),
})

export type ParishionerFormInput = z.input<typeof parishionerSchema>
export type ParishionerFormOutput = z.output<typeof parishionerSchema>
