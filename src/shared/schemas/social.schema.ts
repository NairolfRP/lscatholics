import z from 'zod'

export const discordUsernameSchema = z
  .string({
    error: (iss) =>
      iss.input === undefined
        ? "Vous devez indiquer votre nom d'utilisateur Discord."
        : 'Valeur invalide.',
  })
  .trim()
  .min(2, { error: "Un nom d'utilisateur Discord doit contenir au moins 2 caractères." })
  .max(32, {
    error: (iss) => `Un nom d'utilisateur Discord ne peut pas dépasser ${iss.maximum} caractères.`,
  })
  .regex(/^(?!.*\.\.)[a-z0-9._]+$/, {
    error:
      "Ce n'est pas un nom d'utilisateur valide. Vérifiez que vous indiquez bien le nom d'utilisateur, et non le nom d'affichage.",
  })
