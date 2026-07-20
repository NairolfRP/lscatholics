import z from 'zod'

export const deleteUserFormSchema = (username: string) =>
  z.object({
    typedUsername: z.literal(username, {
      error: `Entrez exactement « ${username} » pour confirmer.`,
    }),
  })

export const deleteUserServerFunctionSchema = z.object({
  typedUsername: z.string().min(1),
})
