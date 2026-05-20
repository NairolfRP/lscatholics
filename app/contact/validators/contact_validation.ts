import vine from '@vinejs/vine'
import { contactSubjectsIds } from '#shared/constants/contact_subjects'
import type { Infer } from '@vinejs/vine/types'

export const contactSchema = vine.object({
  firstname: vine.string().minLength(2).maxLength(50),
  lastname: vine.string().minLength(2).maxLength(50),
  phone: vine.number().withoutDecimals().range([100, 99999999]),
  subject: vine.enum(contactSubjectsIds),
  message: vine.string().minLength(3).maxLength(2000),
})

export const createContactValidator = vine.compile(contactSchema)

export type ContactPayload = Infer<typeof contactSchema>
