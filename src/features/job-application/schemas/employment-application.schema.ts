import { z } from 'zod'
import {
  APPLICATION_SOURCE,
  APPLICATION_SOURCE_VALUES,
  EMPLOYMENT_APPLICATION_MAX_LENGTHS,
  GENDER_VALUES,
  SCHOOL_LEVEL_VALUES,
  SCHOOL_LEVELS_WITHOUT_FIELD_OF_STUDY,
  SPOKEN_LANGUAGE_VALUES,
} from '#/features/job-application/constants/employment-application.constants.tsx'
import { DISTRICT_VALUES } from '#shared/constants/districts.constants.ts'

const MAX = EMPLOYMENT_APPLICATION_MAX_LENGTHS

const nameSchema = (label: string) =>
  z
    .string({ error: `Le ${label} est requis.` })
    .trim()
    .min(2, {
      error: (iss) => `Le ${label} doit comporter au moins ${iss.minimum} caractères.`,
    })
    .max(MAX.NAME, {
      error: (iss) => `Le ${label} ne doit pas dépasser ${iss.maximum} caractères.`,
    })

const optionalShortTextSchema = (max: number, label: string) =>
  z
    .string()
    .trim()
    .max(max, {
      error: (iss) => `${label} ne doit pas dépasser ${iss.maximum} caractères.`,
    })
    .optional()

const ageSchema = z
  .string({ error: 'Veuillez saisir votre âge.' })
  .trim()
  .regex(/^\d{1,3}$/, { error: 'Veuillez saisir un âge valide.' })
  .transform(Number)
  .pipe(
    z
      .number()
      .int()
      .min(18, { error: (iss) => `Vous devez être âgé d'au moins ${iss.minimum} ans.` })
      .max(115, { error: (iss) => `Vous ne pouvez pas être âgé de plus de ${iss.maximum} ans.` })
  )

const phoneSchema = z
  .string({ error: 'Le numéro de téléphone est requis.' })
  .trim()
  .regex(/^\d{3,8}$/, { error: 'Le numéro doit contenir entre 3 et 8 chiffres.' })

const addressSchema = z
  .string({
    error: (iss) => (iss.input === undefined ? "L'adresse est requise." : 'Adresse invalide.'),
  })
  .trim()
  .min(10, { error: (iss) => `L'adresse doit contenir au minimum ${iss.minimum} caractères.` })
  .max(MAX.ADDRESS, {
    error: (iss) => `L'adresse ne peut pas dépasser ${iss.maximum} caractères.`,
  })

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

const optionalEnumSchema = <const T extends readonly string[]>(values: T) =>
  z
    .union([z.enum(values, { error: 'Réponse invalide.' }), z.null()], {
      error: 'Réponse invalide.',
    })
    .optional()
    .transform((value) => value ?? undefined)

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
    type: optionalEnumSchema(APPLICATION_SOURCE_VALUES),
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

const discordUsernameSchema = z
  .string({
    error: (iss) =>
      iss.input === undefined
        ? "Vous devez indiquer votre nom d'utilisateur Discord."
        : 'Valeur invalide.',
  })
  .trim()
  .min(2, { error: "Un nom d'utilisateur Discord doit contenir au moins 2 caractères." })
  .max(MAX.DISCORD_USERNAME, {
    error: (iss) => `Un nom d'utilisateur Discord ne peut pas dépasser ${iss.maximum} caractères.`,
  })
  .regex(/^(?!.*\.\.)[a-z0-9._]+$/, {
    error:
      "Ce n'est pas un nom d'utilisateur valide. Vérifiez que vous indiquez bien le nom d'utilisateur, et non le nom d'affichage.",
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
  age: ageSchema,
  gender: requiredEnumSchema(GENDER_VALUES, 'Veuillez indiquer votre genre.'),
  district: z
    .string({ error: 'Le district est requis.' })
    .refine((value) => DISTRICT_VALUES.includes(value), {
      error: 'Sélectionnez un district valide.',
    }),
  address: addressSchema,
  phone: phoneSchema,
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
