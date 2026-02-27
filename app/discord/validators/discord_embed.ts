import vine from '@vinejs/vine'

const discordEmbedFooterSchema = vine.object({
  text: vine.string(),
  icon_url: vine.string().url().optional(),
  proxy_icon_url: vine.string().url().optional(),
})

const discordEmbedImageSchema = vine.object({
  url: vine.string().url(),
  proxy_url: vine.string().url().optional(),
  height: vine.number().optional(),
  width: vine.number().optional(),
})

const discordEmbedThumbnailSchema = vine.object({
  url: vine.string().url(),
  proxy_url: vine.string().url().optional(),
  height: vine.number().optional(),
  width: vine.number().optional(),
})

const discordEmbedVideoSchema = vine.object({
  url: vine.string().url().optional(),
  proxy_url: vine.string().url().optional(),
  height: vine.number().optional(),
  width: vine.number().optional(),
})

const discordEmbedProviderSchema = vine.object({
  name: vine.string().optional(),
  url: vine.string().url().optional(),
})

const discordEmbedAuthorSchema = vine.object({
  name: vine.string(),
  url: vine
    .string()
    .url({
      require_protocol: true,
      protocols: ['https'],
    })
    .optional(),
  icon_url: vine
    .string()
    .url({
      require_protocol: true,
      protocols: ['https'],
    })
    .optional(),
  proxy_icon_url: vine.string().url().optional(),
})

const discordEmbedFieldSchema = vine.object({
  name: vine.string(),
  value: vine.string(),
  inline: vine.boolean().optional(),
})

export const discordEmbedSchema = vine.object({
  title: vine.string().optional(),
  type: vine.enum(['rich', 'image', 'video', 'gifv', 'article', 'link', 'poll_result']).optional(),
  description: vine.string().optional(),
  url: vine.string().url().optional(),
  timestamp: vine.string().optional(),
  color: vine.number().optional(),
  footer: discordEmbedFooterSchema.optional(),
  image: discordEmbedImageSchema.optional(),
  thumbnail: discordEmbedThumbnailSchema.optional(),
  video: discordEmbedVideoSchema.optional(),
  provider: discordEmbedProviderSchema.optional(),
  author: discordEmbedAuthorSchema.optional(),
  fields: vine.array(discordEmbedFieldSchema).optional(),
})
