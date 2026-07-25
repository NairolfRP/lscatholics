import z from 'zod'
import { pageSchema } from '#/shared/schemas/pagination.schema'
import { POST_STATUS, POST_STATUS_VALUES } from '#shared/constants/post-status.ts'
import { slugSchema } from '#shared/schemas/common.schema.ts'

export const basePostInteractionSchema = z.object({ postId: z.uuidv4() })
export const postStatusSchema = z.enum(POST_STATUS_VALUES, {
  error: (iss) =>
    iss.input === undefined
      ? 'Le statut est requis.'
      : `Seuls les statuts suivants sont acceptés : ${iss.values.join(', ')}`,
})
export const postStatusSchemaWithoutArchived = z.enum(
  POST_STATUS_VALUES.filter((v) => v !== POST_STATUS.ARCHIVED),
  {
    error: (iss) =>
      iss.input === undefined
        ? 'Le statut est requis.'
        : `Seuls les statuts suivants sont acceptés : ${iss.values.join(', ')}`,
  }
)
export const postsSearchSchema = z.object({
  page: pageSchema,
  search: z.string().optional(),
})

export const editPostSchema = z.object({
  title: z
    .string({
      error: (iss) => (iss.input === undefined ? 'Le titre est requis.' : 'Titre invalide.'),
    })
    .trim()
    .min(3, { error: (iss) => `Le titre doit comporter au moins ${iss.minimum} caractères.` })
    .max(255, { error: (iss) => `Le titre ne doit pas dépasser ${iss.maximum} caractères.` }),
  slug: slugSchema.optional(),
  excerpt: z
    .string()
    .trim()
    .max(150, { error: (iss) => `L'extrait ne doit pas dépasser ${iss.maximum} caractères.` })
    .optional(),
  content: z
    .string({
      error: (iss) => (iss.input === undefined ? 'Le contenu est requis.' : 'Contenu invalide.'),
    })
    .trim()
    .min(10, { error: (iss) => `Le contenu doit comporter au moins ${iss.minimum} caractères.` }),
  coverImageUrl: z.url({
    error: (iss) =>
      iss.input === undefined
        ? "L'image de une est requise."
        : "L'image de une doit être une URL valide.",
  }),
  status: postStatusSchema,
  publishedAt: z
    .date()
    .nullable()
    .transform((v) => v ?? null),
})

export type InferEditPostSchema = z.Infer<typeof editPostSchema>
export type EditPostFormInput = z.input<typeof editPostSchema>

export const createPostSchema = editPostSchema.extend({
  status: postStatusSchemaWithoutArchived,
})
export type InferCreatePostSchema = z.Infer<typeof createPostSchema>
export type CreatePostFormInput = z.input<typeof createPostSchema>
