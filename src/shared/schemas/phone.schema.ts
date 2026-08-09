import { z } from 'zod'

export const phoneSchema = z
  .string({ error: 'Le numéro de téléphone est requis.' })
  .trim()
  .regex(/^\d{3,8}$/, { error: 'Le numéro doit contenir entre 3 et 8 chiffres.' })

export const optionalPhoneSchema = z
  .union([phoneSchema, z.literal('')])
  .optional()
  .transform((value) => (value ? value : undefined))
