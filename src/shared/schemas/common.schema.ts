import { z } from 'zod'

export const looseObjectSchema = z.looseObject({})

export const slugSchema = z.string().superRefine((value, ctx) => {
  if (/[A-Z]/.test(value)) {
    ctx.addIssue({
      code: 'custom',
      message: 'Utilisez uniquement des lettres minuscules.',
    })
    return
  }

  if (/\s/.test(value)) {
    ctx.addIssue({
      code: 'custom',
      message: 'Les espaces ne sont pas autorisés.',
    })
    return
  }

  if (/[^a-z0-9-]/.test(value)) {
    ctx.addIssue({
      code: 'custom',
      message: 'Seuls les lettres minuscules, les chiffres et les tirets sont autorisés.',
    })
    return
  }

  if (value.startsWith('-') || value.endsWith('-')) {
    ctx.addIssue({
      code: 'custom',
      message: 'Le nom ne peut pas commencer ou se terminer par un tiret.',
    })
    return
  }

  if (value.includes('--')) {
    ctx.addIssue({
      code: 'custom',
      message: 'Deux tirets consécutifs ne sont pas autorisés.',
    })
    return
  }
})
