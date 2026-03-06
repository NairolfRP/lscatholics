import vine from '@vinejs/vine'

export const createCharacterSessionValidator = vine.create(
  vine.object({
    id: vine.number(),
    data: vine.object({
      id: vine.number().nonNegative(),
      memberid: vine.number().nonNegative().min(0),
      firstname: vine.string().trim().minLength(1),
      lastname: vine.string().trim().minLength(1),
    }),
    selectedAt: vine.number().min(0),
  })
)
