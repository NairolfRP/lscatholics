import z from 'zod'

export const banUserFormSchema = z.object({
  banReason: z.string({
    error: (issue) =>
      issue.input == undefined
        ? 'Vous devez indiquer une raison.'
        : 'Veuillez saisir une chaîne de caractère valide.',
  }),
  banExpiresAt: z
    .date({ error: 'Veuillez saisir une date et une heure valide' })
    .refine((date) => date.getTime() >= Date.now() + 60 * 60 * 1000, {
      error: "La date d'expiration doit être au moins 1 heure dans le futur",
    })
    .refine((date) => date.getTime() < Date.now() + 365 * 24 * 60 * 60 * 1000, {
      error: 'Pour une durée aussi longue, laissez vide le champs pour un bannissement permanent',
    })
    .optional(),
})

export type BanUserForm = z.infer<typeof banUserFormSchema>
