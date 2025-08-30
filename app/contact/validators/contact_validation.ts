import vine from '@vinejs/vine'

export const contactSchema = vine.object({
  firstname: vine.string().minLength(2).maxLength(50),
  lastname: vine.string().minLength(2).maxLength(50),
  phone: vine.number().withoutDecimals().range([100, 99999999]),
  subject: vine.enum(['archbishop', 'sacraments', 'parishes', 'exorcism', 'other']),
  message: vine.string().minLength(3).maxLength(2000),
})

export const createContactValidator = vine.compile(contactSchema)
