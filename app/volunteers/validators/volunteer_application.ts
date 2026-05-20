import vine from '@vinejs/vine'
import {
  addressSchema,
  districtSchema,
  firstnameLastnameSchema,
  middleNameSchema,
  optionalEthnicitySchema,
  optionalPhoneSchema,
  requiredPhoneSchema,
} from '#core/validators/common'
import { getSpokenLanguagesIds } from '#shared/constants/person.constants'
import { getApplicationSourcesIds } from '#shared/constants/employment.constants'
import type { Infer } from '@vinejs/vine/types'

export const createVolunteerApplicationValidator = vine.create({
  firstname: firstnameLastnameSchema,
  middleName: middleNameSchema,
  lastname: firstnameLastnameSchema,
  address: addressSchema,
  district: districtSchema,
  phone: requiredPhoneSchema,
  age: vine.number().withoutDecimals().min(16).max(120),
  emergencyPhone: optionalPhoneSchema,

  interestedActivities: vine.string().trim().maxLength(250).optional(),
  otherLanguages: vine.array(vine.enum(getSpokenLanguagesIds())).optional(),
  ethnicity: optionalEthnicitySchema,

  applicantSource: vine.object({
    type: vine.enum(getApplicationSourcesIds()).optional(),
    employeeReferral: vine
      .string()
      .trim()
      .maxLength(100)
      .optional()
      .requiredWhen('type', '=', 'employeeReferral'),
  }),

  volunteerAvailability: vine.string().maxLength(250).optional(),

  requiredHours: vine.object({
    reason: vine
      .enum(['religious-education', 'court-ordered', 'high-school', 'university', 'other'])
      .optional(),
    deadline: vine.string().trim().maxLength(50).optional().requiredIfExists('reason'),
  }),
})

export type VolunteerApplicationPayload = Infer<typeof createVolunteerApplicationValidator>
