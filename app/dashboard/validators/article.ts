import vine from '@vinejs/vine'
import { noHtmlTags } from '#core/validators/rules/no_html_tags_rule'

export const createArticleValidator = vine.create(
  vine.object({
    title: vine.string().trim().minLength(3).maxLength(255),
    slug: vine
      .string()
      .trim()
      .regex(/^[a-z0-9-]+$/)
      .optional(),
    excerpt: vine.string().trim().minLength(10).maxLength(150).optional(),
    content: vine.string().trim().minLength(10).use(noHtmlTags()),
    coverImageUrl: vine.string().url(),
    status: vine.enum(['draft', 'published', 'archived']),
    publishedAt: vine
      .date({ formats: { utc: true } })
      .nullable()
      .optional(),
  })
)

export const updatedArticleValidator = vine.create(
  vine.object({
    title: vine.string().trim().minLength(3).maxLength(255).optional(),
    slug: vine
      .string()
      .trim()
      .regex(/^[a-z0-9-]+$/)
      .optional(),
    excerpt: vine.string().trim().minLength(10).maxLength(150).optional(),
    content: vine.string().trim().minLength(10).use(noHtmlTags()).optional(),
    coverImageUrl: vine.string().url().optional(),
    status: vine.enum(['draft', 'published', 'archived']).optional(),
    publishedAt: vine
      .date({ formats: { utc: true } })
      .nullable()
      .optional(),
  })
)
