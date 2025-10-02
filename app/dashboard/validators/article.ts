import vine from '@vinejs/vine'
import { sanitizeHtml } from '#dashboard/utils'

export const createArticleValidator = vine.compile(
  vine.object({
    title: vine.string().trim().minLength(3).maxLength(255).escape(),
    slug: vine
      .string()
      .trim()
      .regex(/^[a-z0-9-]+$/)
      .optional(),
    excerpt: vine.string().trim().minLength(10).maxLength(150).optional(),
    content: vine
      .string()
      .trim()
      .minLength(10)
      .transform((v) => sanitizeHtml(v)),
    coverImageUrl: vine.string().url(),
    status: vine.enum(['draft', 'published', 'archived']),
    publishedAt: vine.date().after('today').optional(),
  })
)

export const updatedArticleValidator = vine.compile(
  vine.object({
    title: vine.string().trim().minLength(3).maxLength(255).optional(),
    slug: vine.string().trim().optional(),
    excerpt: vine.string().trim().minLength(10).maxLength(150).optional(),
    content: vine.string().trim().minLength(10).optional(),
    coverImageUrl: vine.string().url().optional().optional(),
    status: vine.enum(['draft', 'published', 'archived']).optional(),
    publishedAt: vine.date().after('today').optional(),
  })
)
