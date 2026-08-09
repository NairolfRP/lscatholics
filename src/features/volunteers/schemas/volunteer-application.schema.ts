import { z } from 'zod'
import {
  APPLICATION_MAX_LENGTHS,
  REQUIRED_HOURS_REASON_VALUES,
} from '#/features/volunteers/constants/volunteer.constants.ts'
import { APPLICATION_SOURCE_VALUES } from '#shared/constants/application-source.ts'
import { DISTRICT_VALUES } from '#shared/constants/districts.constants.ts'
import { ETHNIC_GROUP_VALUES } from '#shared/constants/ethnicity.ts'
import { SPOKEN_LANGUAGE_VALUES } from '#shared/constants/languages.ts'
import { addressSchema, districtSchema } from '#shared/schemas/location.schema.ts'
import { ageSchema, nameSchema } from '#shared/schemas/person.schema.ts'
import { optionalPhoneSchema, phoneSchema } from '#shared/schemas/phone.schema.ts'
import {
  emptyToNull,
  optionalEnumSchema,
  optionalShortTextSchema,
} from '#shared/schemas/utils.schema.ts'

export const volunteerApplicationSchema = z.object({
  firstname: nameSchema('prénom'),
  middleName: optionalShortTextSchema(APPLICATION_MAX_LENGTHS.MIDDLE_NAME),
  lastname: nameSchema('nom de famille'),
  age: ageSchema({
    requiredMessage: 'Veuillez saisir votre âge.',
    min: APPLICATION_MAX_LENGTHS.MIN_AGE,
    minErrorMessage: `L'âge minimum pour devenir bénévole est de ${APPLICATION_MAX_LENGTHS.MIN_AGE} ans.`,
    maxErrorMessage: `L'âge ne peut pas dépasser ${APPLICATION_MAX_LENGTHS.MAX_AGE} ans.`,
  }),
  address: addressSchema(APPLICATION_MAX_LENGTHS.ADDRESS),
  district: districtSchema(DISTRICT_VALUES, 'quartier'),
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
