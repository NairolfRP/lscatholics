import vine from '@vinejs/vine'
import {
  addressSchema,
  districtSchema,
  firstnameLastnameSchema,
  genderSchema,
  phoneSchema,
} from '#core/validators/common'
import {
  getApplicantStatementsIds,
  getApplicationSourcesIds,
} from '#shared/constants/employment.constants'
import { getSchoolLevelsIds, getSpokenLanguagesIds } from '#shared/constants/person.constants'
import { validateYearMonth } from '#core/validators/rules/dates'
import {
  validateAllStatements,
  validateEndDateWithContext,
} from '#careers/validators/rules/employment_application_rules'
import type { Infer } from '@vinejs/vine/types'

export const createEmploymentApplicationValidator = vine.create(
  vine.object({
    firstname: firstnameLastnameSchema,
    lastname: firstnameLastnameSchema,
    middleName: firstnameLastnameSchema.optional(),
    gender: genderSchema,

    age: vine.number().withoutDecimals().min(16).max(115),

    district: districtSchema,
    address: addressSchema,
    phone: phoneSchema,

    isPracticingCatholic: vine.boolean(),
    isLegalUSWorker: vine.boolean(),

    applicationSource: vine.object({
      type: vine.enum(getApplicationSourcesIds()).optional(),
      employeeReferral: vine.string().optional().requiredWhen('type', '=', 'employeeReferral'),
    }),

    education: vine.object({
      highestLevel: vine.enum(getSchoolLevelsIds()),
      fieldOfStudy: vine
        .string()
        .trim()
        .maxLength(100)
        .optional()
        .requiredWhen('highestLevel', 'notIn', ['none', 'highSchoolDiploma']),
    }),

    spokenLanguages: vine.array(vine.enum(getSpokenLanguagesIds())).optional(),

    professionalExperience: vine
      .array(
        vine.object({
          companyName: vine.string().trim().minLength(1).maxLength(100),
          position: vine.string().trim().minLength(1).maxLength(100),
          isCurrentPosition: vine.boolean(),

          reasonForLeaving: vine
            .string()
            .trim()
            .maxLength(255)
            .optional()
            .requiredWhen('isCurrentPosition', '=', false),

          startDate: vine
            .string()
            .regex(/^\d{4}-\d{2}$/)
            .use(validateYearMonth()),

          endDate: vine
            .string()
            .regex(/^\d{4}-\d{2}$/)
            .use(validateYearMonth())
            .optional()
            .requiredWhen('isCurrentPosition', '=', false)
            .use(validateEndDateWithContext()),
        })
      )
      .maxLength(3)
      .optional(),

    hasDriverLicense: vine.boolean(),

    applicantDeclaration: vine
      .array(vine.enum(getApplicantStatementsIds()))
      .use(validateAllStatements(getApplicantStatementsIds())),

    discordUsername: vine
      .string()
      .minLength(2)
      .maxLength(32)
      .regex(/^(?!.*\.\.)[a-z0-9._]+$/),

    motivationsOOC: vine.string().trim().maxLength(1500).optional(),
  })
)

export type EmploymentApplication = Infer<typeof createEmploymentApplicationValidator>
