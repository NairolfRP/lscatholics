import vine from '@vinejs/vine'

export const createDeleteUserConfirmationValidator = (expectedUsername: string) => {
  return vine.compile(
    vine.object({
      username: vine.literal(expectedUsername),
    })
  )
}
