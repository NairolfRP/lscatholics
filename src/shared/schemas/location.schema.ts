import { z } from 'zod'

export function addressSchema(max = 60) {
  return z
    .string({
      error: (iss) => (iss.input === undefined ? "L'adresse est requise." : 'Adresse invalide.'),
    })
    .trim()
    .min(10, { error: (iss) => `L'adresse doit contenir au minimum ${iss.minimum} caractères.` })
    .max(max, { error: (iss) => `L'adresse ne peut pas dépasser ${iss.maximum} caractères.` })
}

export function districtSchema(districtValues: readonly string[], label: string) {
  return z
    .string({ error: `Le ${label} est requis.` })
    .refine((value) => districtValues.includes(value), {
      error: `Sélectionnez un ${label} valide.`,
    })
}
