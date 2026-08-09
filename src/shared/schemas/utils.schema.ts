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
