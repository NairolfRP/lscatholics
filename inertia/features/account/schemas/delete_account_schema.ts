import { z } from 'zod'

export const deleteAccountSchema = (username: string) => {
  return z.object({
    username: z.literal(username, {
      error: `Entrez exactement « ${username} » pour confirmer.`,
    }),
  })
}
