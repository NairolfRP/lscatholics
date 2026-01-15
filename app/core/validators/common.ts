import vine from '@vinejs/vine'
import { civilTitleIds, genderIds, maritalStatusIds } from '#shared/constants/person.constants'
import { getDistrictIds } from '#shared/constants/districts.constants'

export const firstnameLastnameSchema = vine.string().trim().minLength(1).maxLength(50)

export const districtSchema = vine.enum(getDistrictIds())

export const civilTitleSchema = vine.enum(civilTitleIds())

export const maritalStatusSchema = vine.enum(maritalStatusIds())

export const genderSchema = vine.enum(genderIds())
