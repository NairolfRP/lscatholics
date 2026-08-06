import { z } from 'zod'
import { DISTRICT_VALUES } from '#shared/constants/districts.constants.ts'
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
import { PARISH_VALUES } from '#shared/constants/parish.ts'

const nameSchema = (label: string) =>
  z
    .string({ error: `Le ${label} est requis.` })
    .trim()
    .min(2, { error: (iss) => `Le ${label} doit comporter au moins ${iss.minimum} caractères.` })
    .max(50, { error: (iss) => `Le ${label} ne doit pas dépasser ${iss.maximum} caractères.` })

const ageSchema = (requiredMessage: string, min: number) =>
  z
    .string({ error: requiredMessage })
    .trim()
    .refine((value) => /^\d{1,3}$/.test(value), { error: 'Veuillez saisir un âge valide.' })
    .transform((value) => Number(value))
    .pipe(
      z
        .number()
        .int()
        .min(min, {
          error: (iss) =>
            min === 18
              ? "L'âge minimum pour s'enregistrer est de 18 ans."
              : `L'âge ne peut pas être inférieur à ${iss.minimum}.`,
        })
        .max(120, { error: "L'âge ne peut pas dépasser 120 ans." })
    )

const phoneSchema = z
  .string({ error: 'Le numéro de téléphone est requis.' })
  .trim()
  .regex(/^\d{3,8}$/, { error: 'Le numéro doit contenir entre 3 et 8 chiffres.' })

const optionalEnum = <const T extends readonly string[]>(values: T) =>
  z
    .union([z.enum(values, { error: 'Réponse invalide.' }), z.literal('')])
    .optional()
    .transform((value) => (value ? value : undefined))

export const PARISHIONER_PARISH_UNSURE_VALUE = 'unsure'

const familyMemberSchema = z.object({
  firstname: nameSchema('prénom'),
  lastname: nameSchema('nom'),
  age: ageSchema("Veuillez saisir l'âge de ce membre du foyer.", 0),
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
  age: ageSchema('Veuillez saisir votre âge.', 18),
  ethnicCommunity: optionalEnum(ETHNIC_COMMUNITY_VALUES),
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
  address: z
    .string({
      error: (iss) => (iss.input === undefined ? "L'adresse est requise." : 'Adresse invalide.'),
    })
    .trim()
    .min(10, { error: (iss) => `L'adresse doit contenir au minimum ${iss.minimum} caractères.` })
    .max(60, { error: (iss) => `L'adresse ne peut pas dépasser ${iss.maximum} caractères.` }),
  district: z
    .string({ error: 'Le quartier est requis.' })
    .refine((value) => DISTRICT_VALUES.includes(value), {
      error: 'Sélectionnez un quartier valide.',
    }),
  baptized: z.enum(BAPTIZED_VALUES, {
    error: (iss) =>
      iss.input === undefined ? 'Veuillez indiquer si vous êtes baptisé.' : 'Réponse invalide.',
  }),
  religion: optionalEnum(RELIGION_VALUES),
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
