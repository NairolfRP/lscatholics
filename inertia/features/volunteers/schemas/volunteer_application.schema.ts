import { z } from 'zod'
import {
  addressSchema,
  ageSchema,
  districtSchema,
  ethnicitySchema,
  firstnameSchema,
  lastnameSchema,
  middleNameSchema,
  optionalPhoneSchema,
  phoneSchema,
} from '@/shared/schemas/common.schema'
import { getSpokenLanguagesIds } from '#shared/constants/person.constants'
import { getApplicationSourcesIds } from '#shared/constants/employment.constants'

export const volunteerApplicationSchema = z.object({
  firstname: firstnameSchema,
  middleName: middleNameSchema,
  lastname: lastnameSchema,
  address: addressSchema,
  district: districtSchema,
  phone: phoneSchema,
  age: ageSchema,
  emergencyPhone: optionalPhoneSchema,

  interestedActivities: z
    .string()
    .max(250, 'Vous ne devez pas dépasser 250 caractères.')
    .optional(),
  otherLanguages: z
    .array(z.enum(getSpokenLanguagesIds()), { error: 'Valeurs invalides.' })
    .optional(),
  ethnicity: ethnicitySchema.optional(),

  applicantSource: z
    .object({
      type: z.enum(getApplicationSourcesIds(), { error: 'Valeur invalide.' }).optional(),
      employeeReferral: z
        .string({ error: 'Valeur invalide.' })
        .trim()
        .max(100, { error: 'Vous ne devez pas dépasser 100 caractères' })
        .optional(),
    })
    .refine((data) => data.type !== 'employeeReferral' || !!data.employeeReferral, {
      message: "Le nom de l'employé référent est requis.",
      path: ['employeeReferral'],
    }),

  volunteerAvailability: z
    .string()
    .max(250, { error: 'Vous ne devez pas dépasser 250 caractères.' })
    .optional(),

  requiredHours: z
    .object({
      reason: z
        .enum(['religious-education', 'court-ordered', 'high-school', 'university', 'other'])
        .optional(),
      deadline: z
        .string()
        .trim()
        .max(50, { error: 'Vous ne devez pas dépasser 50 caractères.' })
        .optional(),
    })
    .transform((data) => {
      if (!data.reason) {
        return { ...data, deadline: undefined }
      }
      return data
    })
    .refine((data) => !(data.reason && !data.deadline), {
      message: "La date d'échéance est requise.",
      path: ['deadline'],
    }),
})

export type VolunteerApplication = z.Infer<typeof volunteerApplicationSchema>
