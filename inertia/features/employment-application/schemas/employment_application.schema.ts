import { z } from 'zod'
import {
  addressSchema,
  districtSchema,
  firstnameSchema,
  genderSchema,
  lastnameSchema,
  middleNameSchema,
  phoneSchema,
  yesNoSchema,
} from '@/shared/schemas/common.schema'
import {
  getApplicantStatementsIds,
  getApplicationSourcesIds,
} from '#shared/constants/employment.constants'
import { getSchoolLevelsIds, getSpokenLanguagesIds } from '#shared/constants/person.constants'
import { schoolLevelsWithoutFieldOfStudy } from '@/features/employment-application/constants/employment_application_form.constants'

export const employmentApplicationSchema = z.object({
  firstname: firstnameSchema,
  lastname: lastnameSchema,
  middleName: middleNameSchema,
  gender: genderSchema,
  age: z
    .int({
      error: (issue) => (issue.input === undefined ? "L'âge est requis." : 'Valeur invalide.'),
    })
    .min(16, { error: "Vous devez être âgé d'au moins 16 ans." })
    .max(115, { error: 'Vous ne pouvez pas être âgé de plus de 115 ans.' }),

  district: districtSchema,
  address: addressSchema,
  phone: phoneSchema,

  isPracticingCatholic: yesNoSchema,
  isLegalUSWorker: yesNoSchema,
  applicationSource: z
    .object({
      type: z.enum(getApplicationSourcesIds(), { error: 'Valeur invalide.' }).optional(),
      employeeReferral: z
        .string({
          error: 'Valeur invalide.',
        })
        .trim()
        .max(100, { error: 'Vous ne devez pas dépasser 100 caractères' })
        .optional(),
    })
    .refine(
      (data) => {
        if (data.type === 'employeeReferral') {
          return !!data.employeeReferral
        }
        return true
      },
      {
        message: "Le nom de l'employé référent est requis.",
        path: ['employeeReferral'],
      }
    ),

  education: z
    .object({
      highestLevel: z.enum(getSchoolLevelsIds(), {
        error: (issue) =>
          issue.input === undefined
            ? "Vous devez indiquer votre plus haut niveau d'éducation."
            : 'Valeur invalide.',
      }),
      fieldOfStudy: z
        .string()
        .trim()
        .max(100, { error: 'Vous ne devez pas dépasser 100 caractères' })
        .optional(),
    })
    .refine(
      (data) => {
        if (schoolLevelsWithoutFieldOfStudy.includes(data.highestLevel)) return true

        return Boolean(data.fieldOfStudy)
      },
      {
        message: "Vous devez préciser le domaine d'études.",
        path: ['fieldOfStudy'],
      }
    ),
  spokenLanguages: z
    .array(z.enum(getSpokenLanguagesIds()), { error: 'Valeurs invalides.' })
    .optional(),

  professionalExperience: z
    .array(
      z
        .object({
          companyName: z
            .string()
            .min(1, { error: 'Le nom de la compagnie est requis' })
            .max(100, { error: 'Le nom de la compagnie ne peut pas dépasser 100 caractères' })
            .trim(),

          position: z
            .string()
            .min(1, { error: 'Le poste est requis' })
            .max(100, { error: 'Le poste ne peut pas dépasser 100 caractères' })
            .trim(),

          isCurrentPosition: z.boolean(),

          reasonForLeaving: z
            .string()
            .max(255, { error: 'La raison du départ ne peut pas dépasser 255 caractères' })
            .trim()
            .optional(),

          startDate: z
            .string()
            .regex(/^\d{4}-\d{2}$/, 'Format requis: YYYY-MM')
            .refine(
              (date) => {
                const [year, month] = date.split('-').map(Number)
                return (
                  year >= 1950 && year <= new Date().getFullYear() + 1 && month >= 1 && month <= 12
                )
              },
              { error: 'Date de début invalide' }
            ),

          endDate: z
            .string()
            .regex(/^\d{4}-\d{2}$/, 'Format requis: YYYY-MM')
            .refine(
              (date) => {
                const [year, month] = date.split('-').map(Number)
                return (
                  year >= 1950 && year <= new Date().getFullYear() + 1 && month >= 1 && month <= 12
                )
              },
              { error: 'Date de fin invalide' }
            )
            .optional(),
        })
        .superRefine((val, ctx) => {
          if (!val.isCurrentPosition) {
            if (!val.endDate) {
              ctx.addIssue({
                code: 'too_small',
                minimum: 1,
                origin: 'string',
                message: "Date de fin requise si le poste n'est plus actuel",
                path: ['endDate'],
                input: val.endDate,
              })
            }

            if (!val.reasonForLeaving || val.reasonForLeaving.trim() === '') {
              ctx.addIssue({
                code: 'too_small',
                minimum: 1,
                origin: 'string',
                message: "La raison du départ est requise si vous n'occupez plus ce poste",
                path: ['reasonForLeaving'],
                input: val.reasonForLeaving,
              })
            }

            if (val.startDate && val.endDate) {
              const start = new Date(val.startDate + '-01')
              const end = new Date(val.endDate + '-01')

              if (!Number.isNaN(start.getTime()) && !Number.isNaN(end.getTime()) && end < start) {
                ctx.addIssue({
                  code: 'custom',
                  message: 'La date de fin doit être postérieure à la date de début',
                  path: ['endDate'],
                  input: val.endDate,
                })
              }
            }
          }
        })
    )
    .max(3, 'Vous ne pouvez pas ajouter plus de 3 expériences professionnelles'),

  hasDriverLicense: yesNoSchema,

  applicantDeclaration: z.array(z.enum(getApplicantStatementsIds())).refine(
    (value) => {
      const requiredIds = getApplicantStatementsIds()
      return value.length === requiredIds.length && requiredIds.every((id) => value.includes(id))
    },
    {
      error: 'Vous devez comprendre et accepter (cocher) toutes les clauses de la déclaration.',
    }
  ),

  discordUsername: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Vous devez indiquer votre nom d'utilisateur Discord."
          : 'Valeur invalide.',
    })
    .min(2, { error: "Un nom d'utilisateur discord doit contenir au moins 2 caractères." })
    .max(32, { error: "Un nom d'utilisateur Discord ne peut pas dépasser 32 caractères." })
    .regex(/^[a-z0-9._]+$/, {
      error:
        "Ce n'est pas un nom d'utilisateur valide. Vérifiez que vous indiquez bien le nom d'utilisateur, et non le nom d'affichage.",
    })
    .refine((value) => value === value.toLowerCase(), {
      error:
        "Ce n'est pas un nom d'utilisateur valide. Vérifiez que vous indiquez bien le nom d'utilisateur, et non le nom d'affichage.",
    })
    .refine((value) => !value.includes('..'), {
      error:
        "Ce n'est pas un nom d'utilisateur valide. Vérifiez que vous indiquez bien le nom d'utilisateur, et non le nom d'affichage.",
    }),

  motivationsOOC: z
    .string()
    .trim()
    .max(1500, { error: 'Vous ne devez pas dépasser 1500 caractères.' })
    .optional(),
})
