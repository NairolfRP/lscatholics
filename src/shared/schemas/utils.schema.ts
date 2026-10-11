import { z } from 'zod'

export const looseObjectSchema = z.looseObject({})

export const emptyToNull = <T extends z.ZodTypeAny>(schema: T) =>
  z
    .union([z.literal(''), z.undefined(), z.null(), schema])
    .transform((val) => (val === '' || val == null ? null : val))

export function optionalEnumSchema<const T extends readonly string[]>(
  values: T,
  options: { errorMessage?: string; emptyValue?: '' | null; unionError?: string } = {}
) {
  const { errorMessage = 'Réponse invalide.', emptyValue: empty = '', unionError } = options
  const emptySchema = empty === null ? z.null() : z.literal('')

  return z
    .union([z.enum(values, { error: errorMessage }), emptySchema], unionError)
    .optional()
    .transform((value) => (value ? value : undefined))
}

export const optionalShortTextSchema = (max: number) =>
  z
    .string()
    .trim()
    .max(max, { error: (iss) => `Ne doit pas dépasser ${iss.maximum} caractères.` })
    .optional()
    .transform((value) => (value ? value : undefined))

export const EYEFIND_MAIL_MAX = 255

export const optionalEyefindMailSchema = z
  .string()
  .trim()
  .max(EYEFIND_MAIL_MAX, {
    error: `L'adresse EyefindMail ne doit pas dépasser ${EYEFIND_MAIL_MAX} caractères.`,
  })
  .optional()
  .transform((value) => (value ? value : undefined))
  .pipe(
    z.union([
      z.undefined(),
      z.email({
        error:
          "L'adresse EyefindMail doit être une adresse valide (ex. prenom.nom@mail.eyefind.fr).",
      }),
    ])
  )
