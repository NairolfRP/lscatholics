import vine from '@vinejs/vine'
import { civilTitleIds, genderIds, maritalStatusIds } from '#shared/constants/person.constants'
import { getDistrictIds } from '#shared/constants/districts.constants'
import { phoneRule } from '#core/validators/rules/phone_rule'
import { getEthnicsGroupsIds } from '#shared/constants/ethnicity.constants'

export const firstnameLastnameSchema = vine.string().trim().minLength(1).maxLength(30)

export const middleNameSchema = firstnameLastnameSchema.optional()

export const districtSchema = vine.enum(getDistrictIds())

export const civilTitleSchema = vine.enum(civilTitleIds())

export const maritalStatusSchema = vine.enum(maritalStatusIds())

export const genderSchema = vine.enum(genderIds())

export const optionalEthnicitySchema = vine.enum(getEthnicsGroupsIds()).optional()

export const addressSchema = vine.string().trim().minLength(10).maxLength(255)

export const requiredPhoneSchema = vine
  .string()
  .use(phoneRule())
  .transform((value) => value.replace(/\s/g, ''))

export const optionalPhoneSchema = vine
  .string()
  .optional()
  .use(phoneRule({ required: false }))
  .transform((value) => value.replace(/\s/g, ''))

export const yesNoSchema = vine
  .enum(['yes', 'no'])
  .transform((v) => (v === undefined ? undefined : v === 'yes'))
