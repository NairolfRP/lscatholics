import vine from '@vinejs/vine'
import { DiscordFlag } from '#types/discord/interfaces/entities/discord_flags'
import { discordEmbedSchema } from '#validators/discord_embed'

export const createDiscordWebhookUrlValidator = vine.compile(
  vine
    .string()
    .url({ require_protocol: true, protocols: ['https'] })
    .regex(/^https:\/\/(discord(app)?\.com)\/api\/webhooks\/\d+\/[\w-]+$/)
)

export const createDiscordWebhookValidator = vine.compile(
  vine.object({
    content: vine.string().maxLength(2000),
    username: vine.string().optional(),
    avatar_url: vine.string().url().optional(),
    tts: vine.boolean().optional(),
    embeds: vine.array(discordEmbedSchema).optional(),
    // allowed_mentions:,
    // components:,
    // attachements:,
    flags: vine.array(vine.enum(Object.values(DiscordFlag))).optional(),
    thread_name: vine.string().optional(),
    applied_tags: vine.array(vine.string()).optional(),
    //poll:,
  })
)
