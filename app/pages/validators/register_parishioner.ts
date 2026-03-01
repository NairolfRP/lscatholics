import vine from '@vinejs/vine'
import {
  civilTitleSchema,
  districtSchema,
  firstnameLastnameSchema,
  genderSchema,
  maritalStatusSchema,
  optionalPhoneSchema,
  requiredPhoneSchema,
} from '#core/validators/common'
import {
  catholicOrOtherIds,
  householdRoleIds,
  individualSacramentIds,
} from '#shared/constants/person.constants'
import { getLocalEthnicsCommunitiesIds } from '#shared/constants/ethnicity.constants'
import type { Infer } from '@vinejs/vine/types'

const registerParishionerSchema = vine.object({
  //recordType: vine.enum(['new', 'update']),

  civilTitle: civilTitleSchema,
  maritalStatus: maritalStatusSchema,
  firstname: firstnameLastnameSchema,
  lastname: firstnameLastnameSchema,
  gender: genderSchema,

  age: vine.number().withoutDecimals().min(16).max(120),

  ethnicCommunity: vine.enum(getLocalEthnicsCommunitiesIds()),

  occupation: vine.string().trim().maxLength(200).optional(),

  phone: requiredPhoneSchema,

  emergencyPhone: optionalPhoneSchema,

  address: vine.string().trim().minLength(10).maxLength(60),

  district: districtSchema,

  baptized: vine.enum(['yes', 'no', 'unsure']),

  religion: vine.enum(catholicOrOtherIds()),

  parish: vine.number().withoutDecimals().nonNegative(),

  familyMembers: vine
    .array(
      vine.object({
        firstname: firstnameLastnameSchema,
        lastname: firstnameLastnameSchema,
        age: vine.number().withoutDecimals().min(0).max(120),
        role: vine.enum(householdRoleIds()),
        isNpc: vine.boolean(),
      })
    )
    .maxLength(5)
    .optional(),

  message: vine.string().trim().maxLength(300).optional(),

  characterSacraments: vine.array(vine.enum(individualSacramentIds())).optional(),

  oocAdditionalInformation: vine.string().trim().maxLength(700).optional(),
})

export const createRegisterParishionerValidator = vine.compile(registerParishionerSchema)

export type RegisterParishionerPayload = Infer<typeof registerParishionerSchema>
