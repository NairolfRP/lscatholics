import { z } from 'zod'
import {
  APPLICATION_MAX_LENGTHS,
  APPLICATION_SOURCE_VALUES,
  REQUIRED_HOURS_REASON_VALUES,
  SPOKEN_LANGUAGE_VALUES,
} from '#/features/volunteers/constants/volunteer.constants.ts'
import { DISTRICT_VALUES } from '#shared/constants/districts.constants.ts'
import { emptyToNull } from '#shared/schemas/utils.schema.ts'
import { ETHNIC_GROUP_VALUES } from '#shared/constants/ethnicity.ts'

const nameSchema = (label: string) =>
  z
    .string({ error: `Le ${label} est requis.` })
    .trim()
    .min(2, { error: (iss) => `Le ${label} doit comporter au moins ${iss.minimum} caractères.` })
    .max(APPLICATION_MAX_LENGTHS.FIRSTNAME, {
      error: (iss) => `Le ${label} ne doit pas dépasser ${iss.maximum} caractères.`,
    })

const ageSchema = z
  .string({ error: 'Veuillez saisir votre âge.' })
  .trim()
  .refine((value) => /^\d{1,3}$/.test(value), { error: 'Veuillez saisir un âge valide.' })
  .transform((value) => Number(value))
  .pipe(
    z
      .number()
      .int()
      .min(APPLICATION_MAX_LENGTHS.MIN_AGE, {
        error: (iss) => `L'âge minimum pour devenir bénévole est de ${iss.minimum} ans.`,
      })
      .max(APPLICATION_MAX_LENGTHS.MAX_AGE, {
        error: (iss) => `L'âge ne peut pas dépasser ${iss.maximum} ans.`,
      })
  )

const phoneSchema = z
  .string({ error: 'Le numéro de téléphone est requis.' })
  .trim()
  .regex(/^\d{3,8}$/, { error: 'Le numéro doit contenir entre 3 et 8 chiffres.' })

const optionalPhoneSchema = z
  .union([phoneSchema, z.literal('')])
  .optional()
  .transform((value) => (value ? value : undefined))

const optionalShortTextSchema = (max: number) =>
  z
    .string()
    .trim()
    .max(max, { error: (iss) => `Ne doit pas dépasser ${iss.maximum} caractères.` })
    .optional()
    .transform((value) => (value ? value : undefined))

const optionalEnumSchema = <const T extends readonly string[]>(values: T) =>
  z
    .union([z.enum(values, { error: 'Réponse invalide.' }), z.literal('')])
    .optional()
    .transform((value) => (value ? value : undefined))

export const volunteerApplicationSchema = z.object({
  firstname: nameSchema('prénom'),
  middleName: optionalShortTextSchema(APPLICATION_MAX_LENGTHS.MIDDLE_NAME),
  lastname: nameSchema('nom de famille'),
  age: ageSchema,
  address: z
    .string({
      error: (iss) => (iss.input === undefined ? "L'adresse est requise." : 'Adresse invalide.'),
    })
    .trim()
    .min(10, { error: (iss) => `L'adresse doit contenir au minimum ${iss.minimum} caractères.` })
    .max(APPLICATION_MAX_LENGTHS.ADDRESS, {
      error: (iss) => `L'adresse ne peut pas dépasser ${iss.maximum} caractères.`,
    }),
  district: z
    .string({ error: 'Le quartier est requis.' })
    .refine((value) => DISTRICT_VALUES.includes(value), {
      error: 'Sélectionnez un quartier valide.',
    }),
  phone: phoneSchema,
  emergencyPhone: optionalPhoneSchema,
  interestedActivities: optionalShortTextSchema(APPLICATION_MAX_LENGTHS.INTERESTED_ACTIVITIES),
  otherLanguages: z
    .array(z.enum(SPOKEN_LANGUAGE_VALUES, { error: 'Réponse invalide.' }))
    .default([]),
  ethnicity: emptyToNull(optionalEnumSchema(ETHNIC_GROUP_VALUES)),
  applicantSource: z
    .object({
      type: emptyToNull(optionalEnumSchema(APPLICATION_SOURCE_VALUES)),
      employeeReferral: optionalShortTextSchema(APPLICATION_MAX_LENGTHS.EMPLOYEE_REFERRAL),
    })
    .superRefine((data, ctx) => {
      if (data.type === 'employeeReferral' && !data.employeeReferral) {
        ctx.addIssue({
          code: 'custom',
          message: "Le nom de l'employé référent est requis.",
          path: ['employeeReferral'],
        })
      }
    }),
  volunteerAvailability: optionalShortTextSchema(APPLICATION_MAX_LENGTHS.AVAILABILITY),
  requiredHours: z
    .object({
      reason: emptyToNull(optionalEnumSchema(REQUIRED_HOURS_REASON_VALUES)),
      deadline: optionalShortTextSchema(APPLICATION_MAX_LENGTHS.DEADLINE),
    })
    .superRefine((data, ctx) => {
      if (data.reason && !data.deadline) {
        ctx.addIssue({
          code: 'custom',
          message: "La date d'échéance est requise.",
          path: ['deadline'],
        })
      }
    }),
})

export type VolunteerApplicationInput = z.input<typeof volunteerApplicationSchema>
export type VolunteerApplicationOutput = z.output<typeof volunteerApplicationSchema>
