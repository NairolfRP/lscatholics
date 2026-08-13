import { z } from 'zod'
import {
  EMPLOYMENT_APPLICATION_MAX_LENGTHS,
  SCHOOL_LEVEL_VALUES,
  SCHOOL_LEVELS_WITHOUT_FIELD_OF_STUDY,
} from '#/features/job-application/constants/employment-application.constants.tsx'
import {
  APPLICATION_SOURCE,
  APPLICATION_SOURCE_VALUES,
} from '#shared/constants/application-source.ts'
import { DISTRICT_VALUES } from '#shared/constants/districts.constants.ts'
import { GENDER_VALUES } from '#shared/constants/gender.ts'
import { SPOKEN_LANGUAGE_VALUES } from '#shared/constants/languages.ts'
import { individualIban } from '#shared/schemas/banking.schema.ts'
import { addressSchema, districtSchema } from '#shared/schemas/location.schema.ts'
import { ageSchema, nameSchema } from '#shared/schemas/person.schema.ts'
import { phoneSchema } from '#shared/schemas/phone.schema.ts'
import { discordUsernameSchema } from '#shared/schemas/social.schema.ts'
import { optionalEnumSchema } from '#shared/schemas/utils.schema'

const MAX = EMPLOYMENT_APPLICATION_MAX_LENGTHS

const optionalShortTextSchema = (max: number, label: string) =>
  z
    .string()
    .trim()
    .max(max, {
      error: (iss) => `${label} ne doit pas dépasser ${iss.maximum} caractères.`,
    })
    .optional()

const yesNoBooleanSchema = z.boolean({
  error: (iss) => (iss.input === undefined ? 'Cette question est requise.' : 'Réponse invalide.'),
})

const requiredEnumSchema = <const T extends readonly [string, ...string[]]>(
  values: T,
  requiredMessage: string
) =>
  z.enum(values, {
    error: (iss) => (iss.input == null ? requiredMessage : 'Réponse invalide.'),
  })

const yearMonthSchema = z
  .string({ error: 'Veuillez saisir une date.' })
  .regex(/^\d{4}-\d{2}$/, { error: 'Format requis : YYYY-MM' })
  .refine(
    (value) => {
      const [year, month] = value.split('-').map(Number)
      return year >= 1950 && year <= new Date().getFullYear() + 1 && month >= 1 && month <= 12
    },
    { error: 'Saisissez une date valide.' }
  )

const applicationSourceSchema = z
  .object({
    type: optionalEnumSchema(APPLICATION_SOURCE_VALUES, { emptyValue: null }),
    employeeReferral: optionalShortTextSchema(
      MAX.EMPLOYEE_REFERRAL,
      "Le nom de l'employé référent"
    ),
  })
  .superRefine((data, ctx) => {
    if (data.type === APPLICATION_SOURCE.EMPLOYEE_REFERRAL && !data.employeeReferral) {
      ctx.addIssue({
        code: 'custom',
        message: "Le nom de l'employé référent est requis.",
        path: ['employeeReferral'],
      })
    }
  })

const educationSchema = z
  .object({
    highestLevel: requiredEnumSchema(
      SCHOOL_LEVEL_VALUES,
      "Vous devez indiquer votre plus haut niveau d'éducation."
    ),
    fieldOfStudy: optionalShortTextSchema(MAX.FIELD_OF_STUDY, "Le domaine d'études"),
  })
  .superRefine((data, ctx) => {
    if (!SCHOOL_LEVELS_WITHOUT_FIELD_OF_STUDY.includes(data.highestLevel) && !data.fieldOfStudy) {
      ctx.addIssue({
        code: 'custom',
        message: "Vous devez préciser le domaine d'études.",
        path: ['fieldOfStudy'],
      })
    }
  })

const baseExperienceSchema = z.object({
  companyName: z
    .string({ error: 'Le nom de la compagnie est requis.' })
    .trim()
    .min(1, { error: 'Le nom de la compagnie est requis.' })
    .max(MAX.COMPANY_NAME, {
      error: (iss) => `Le nom de la compagnie ne peut pas dépasser ${iss.maximum} caractères.`,
    }),
  position: z
    .string({ error: 'Le poste est requis.' })
    .trim()
    .min(1, { error: 'Le poste est requis.' })
    .max(MAX.POSITION, {
      error: (iss) => `Le poste ne peut pas dépasser ${iss.maximum} caractères.`,
    }),
  startDate: yearMonthSchema,
})

const currentExperienceSchema = baseExperienceSchema.extend({
  isCurrentPosition: z.literal(true),
})

const pastExperienceSchema = baseExperienceSchema
  .extend({
    isCurrentPosition: z.literal(false),
    endDate: yearMonthSchema,
    reasonForLeaving: z
      .string({ error: "La raison du départ est requise si vous n'occupez plus ce poste." })
      .trim()
      .min(1, { error: "La raison du départ est requise si vous n'occupez plus ce poste." })
      .max(MAX.REASON_FOR_LEAVING, {
        error: (iss) => `La raison du départ ne peut pas dépasser ${iss.maximum} caractères.`,
      }),
  })
  .refine(
    (data) => {
      const start = new Date(`${data.startDate}-01`).getTime()
      const end = new Date(`${data.endDate}-01`).getTime()
      return end >= start
    },
    {
      message: 'La date de fin doit être postérieure à la date de début.',
      path: ['endDate'],
    }
  )

const professionalExperienceSchema = z
  .array(z.discriminatedUnion('isCurrentPosition', [currentExperienceSchema, pastExperienceSchema]))
  .max(MAX.MAX_PROFESSIONAL_EXPERIENCE, {
    error: `Vous ne pouvez pas ajouter plus de ${MAX.MAX_PROFESSIONAL_EXPERIENCE} expériences professionnelles.`,
  })

const applicantDeclarationAcceptedSchema = z
  .boolean({
    error: (iss) =>
      iss.input === undefined
        ? 'Vous devez comprendre et accepter la déclaration pour postuler.'
        : 'Réponse invalide.',
  })
  .refine((value) => value, {
    error: 'Vous devez comprendre et accepter la déclaration pour postuler.',
  })

const motivationsOOCSchema = z
  .string()
  .trim()
  .max(MAX.MOTIVATIONS, {
    error: (iss) => `Vous ne devez pas dépasser ${iss.maximum} caractères.`,
  })
  .optional()
  .transform((value) => (value ? value : undefined))

export const employmentApplicationSchema = z.object({
  firstname: nameSchema('prénom'),
  lastname: nameSchema('nom de famille'),
  middleName: optionalShortTextSchema(MAX.NAME, 'Le deuxième prénom'),
  age: ageSchema({
    requiredMessage: 'Veuillez saisir votre âge.',
    min: 18,
    max: 115,
    minErrorMessage: "Vous devez être âgé d'au moins 18 ans.",
    maxErrorMessage: 'Vous ne pouvez pas être âgé de plus de 115 ans.',
  }),
  gender: requiredEnumSchema(GENDER_VALUES, 'Veuillez indiquer votre genre.'),
  district: districtSchema(DISTRICT_VALUES, 'district'),
  address: addressSchema(MAX.ADDRESS),
  phone: phoneSchema,
  iban: individualIban,
  isPracticingCatholic: yesNoBooleanSchema,
  hasDriverLicense: yesNoBooleanSchema,
  applicationSource: applicationSourceSchema,
  education: educationSchema,
  spokenLanguages: z
    .array(z.enum(SPOKEN_LANGUAGE_VALUES, { error: 'Langue invalide.' }))
    .default([]),
  professionalExperience: professionalExperienceSchema,
  applicantDeclarationAccepted: applicantDeclarationAcceptedSchema,
  discordUsername: discordUsernameSchema,
  motivationsOOC: motivationsOOCSchema,
})

export type EmploymentApplicationInput = z.input<typeof employmentApplicationSchema>
export type EmploymentApplicationOutput = z.output<typeof employmentApplicationSchema>
