import { z } from 'zod'

export function nameSchema(label: string, max = 50) {
  return z
    .string({ error: `Le ${label} est requis.` })
    .trim()
    .min(2, { error: (iss) => `Le ${label} doit comporter au moins ${iss.minimum} caractères.` })
    .max(max, { error: (iss) => `Le ${label} ne doit pas dépasser ${iss.maximum} caractères.` })
}

export function ageSchema({
  requiredMessage,
  min,
  max = 120,
  minErrorMessage,
  maxErrorMessage,
}: {
  requiredMessage: string
  min: number
  max?: number
  minErrorMessage?: string
  maxErrorMessage?: string
}) {
  return z
    .string({ error: requiredMessage })
    .trim()
    .refine((value) => /^\d{1,3}$/.test(value), { error: 'Veuillez saisir un âge valide.' })
    .transform((value) => Number(value))
    .pipe(
      z
        .number()
        .int()
        .min(min, {
          error: (iss) =>
            minErrorMessage ??
            (min === 18
              ? "L'âge minimum pour s'enregistrer est de 18 ans."
              : `L'âge ne peut pas être inférieur à ${iss.minimum}.`),
        })
        .max(max, {
          error: (iss) => maxErrorMessage ?? `L'âge ne peut pas dépasser ${iss.maximum} ans.`,
        })
    )
}
