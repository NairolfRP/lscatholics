import type { DiscordAllowedMentions } from '#discord/types/interfaces/entities/discord_allowed_mentions'
import { DiscordFlag } from '#discord/constants/discord.constants'
import type { DiscordEmbed } from '#discord/types/interfaces/entities/discord_embed'

export type DiscordWebhookServiceInitProps = {
  url: string
  timeout?: number
  retries?: number
}

export type DiscordWebhookOptions = {
  waitServerConfirmation?: boolean
  username?: string
  avatarUrl?: string
  allowedMentions?: DiscordAllowedMentions
  flags?: (typeof DiscordFlag)[]
  tts?: boolean
  thread?: {
    id?: string | number
    name?: string
    tags?: string[]
  }
}

export type WebhookExecutionResult = {
  success: boolean
  error?: string
  data?: {
    type: number
    content: string
    mention_roles: string[]
    attachments: any[]
    embeds: DiscordEmbed[]
    timestamp: string
    edited_timestamp: string | null
    flags: number
    components: any[]
    id: string
    channel_id: string
    author: {
      id: string
      username: string
      avatar: string | null
      discriminator: string
      public_flags: number
      flags: number
      bot: boolean
      global_name: string | null
      clan: string | null
      primary_guild: string | null
    }
    pinned: boolean
    mention_everyone: boolean
    tts: boolean
    webhook_id: boolean
    position: number
  }
}
