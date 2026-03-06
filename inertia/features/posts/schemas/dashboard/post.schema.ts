import { z } from 'zod'

export const createPostSchema = z.object({
  title: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? 'Le titre est requis.'
          : 'Le titre doit être une chaîne de caractères.',
    })
    .trim()
    .min(3, { error: 'Le titre doit comporter au moins 3 caractères.' })
    .max(255, { error: 'Le titre ne doit pas dépasser 255 caractères.' }),
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9-]+$/)
    .optional(),
  excerpt: z
    .string()
    .trim()
    .min(10, { error: "L'extrait doit comporter au moins 10 caractères." })
    .max(150, { error: "L'extrait ne doit pas dépasser 150 caractères." })
    .optional(),
  content: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? 'Le content est requis.'
          : 'Le contenu doit être une chaîne de caractères.',
    })
    .trim()
    .min(10, { error: 'Le contenu doit comporter au moins 10 caractères.' }),
  coverImageUrl: z.url({
    error: (issue) =>
      issue.input === undefined
        ? 'Une image de une est requise.'
        : "L'image de une doit être une URL.",
  }),
  status: z.enum(['draft', 'published', 'archived']),
  publishedAt: z.date().nullable().optional(),
})

export const editPostSchema = createPostSchema
