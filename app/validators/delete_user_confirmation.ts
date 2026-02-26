import vine from '@vinejs/vine'

export const createDeleteUserConfirmationValidator = (expectedUsername: string) => {
  return vine.create(
    vine.object({
      username: vine.literal(expectedUsername),
    })
  )
}
