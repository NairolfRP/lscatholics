import type {
  APIAllowedMentions,
  APIEmbed,
  APIGuildMember,
  APIMessage,
  RESTPostAPIChannelMessageJSONBody,
  RESTPostAPIChannelMessageResult,
  RESTPostAPIWebhookWithTokenJSONBody,
  RESTPostAPIWebhookWithTokenQuery,
  Snowflake,
} from 'discord-api-types/v10'
import ky from 'ky'
import { env } from '#/config/env.server.ts'

const DISCORD_API_BASE_URL = 'https://discord.com/api/v10'
const REQUEST_TIMEOUT = 10_000

export type DiscordEmbed = APIEmbed
export type DiscordAllowedMentions = APIAllowedMentions
export type DiscordWebhookPayload = RESTPostAPIWebhookWithTokenJSONBody
export type DiscordWebhookQuery = RESTPostAPIWebhookWithTokenQuery
export type DiscordChannelMessagePayload = RESTPostAPIChannelMessageJSONBody

export interface SendWebhookMessageOptions {
  wait?: boolean
  threadId?: Snowflake
  withComponents?: boolean
}

export interface SendWebhookMessageFile {
  name: string
  data: Blob
  contentType?: string
}

export interface SendWebhookMessageInput extends SendWebhookMessageOptions {
  url: string
  payload: DiscordWebhookPayload
  files?: SendWebhookMessageFile[]
}

export async function sendWebhookMessage({
  url,
  payload,
  wait = false,
  threadId,
  withComponents,
  files,
}: SendWebhookMessageInput): Promise<APIMessage | undefined> {
  const searchParams = {
    wait,
    ...(threadId ? { thread_id: threadId } : {}),
    ...(withComponents ? { with_components: true } : {}),
  }
  const requestOptions = { searchParams, timeout: REQUEST_TIMEOUT, retry: 0 }

  if (files && files.length > 0) {
    const formData = new FormData()
    formData.append('payload_json', JSON.stringify(payload))
    files.forEach((file, index) => {
      formData.append(
        `files[${index}]`,
        new File([file.data], file.name, { type: file.contentType })
      )
    })

    const response = await ky.post(url, { ...requestOptions, body: formData })
    return wait ? await response.json<APIMessage>() : undefined
  }

  const response = await ky.post(url, { ...requestOptions, json: payload })
  return wait ? await response.json<APIMessage>() : undefined
}

function botClient() {
  return ky.create({
    prefix: DISCORD_API_BASE_URL,
    timeout: REQUEST_TIMEOUT,
    headers: {
      Authorization: `Bot ${env.DISCORD_BOT_TOKEN}`,
    },
  })
}

export const discordBotClient = {
  sendChannelMessage({
    channelId,
    payload,
  }: {
    channelId: Snowflake
    payload: DiscordChannelMessagePayload
  }): Promise<RESTPostAPIChannelMessageResult> {
    return botClient()
      .post(`channels/${channelId}/messages`, { json: payload })
      .json<RESTPostAPIChannelMessageResult>()
  },

  getGuildMember({
    guildId,
    userId,
  }: {
    guildId: Snowflake
    userId: Snowflake
  }): Promise<APIGuildMember> {
    return botClient().get(`guilds/${guildId}/members/${userId}`).json<APIGuildMember>()
  },

  async addGuildMemberRole({
    guildId,
    userId,
    roleId,
  }: {
    guildId: Snowflake
    userId: Snowflake
    roleId: Snowflake
  }): Promise<void> {
    await botClient().put(`guilds/${guildId}/members/${userId}/roles/${roleId}`)
  },

  async removeGuildMemberRole({
    guildId,
    userId,
    roleId,
  }: {
    guildId: Snowflake
    userId: Snowflake
    roleId: Snowflake
  }): Promise<void> {
    await botClient().delete(`guilds/${guildId}/members/${userId}/roles/${roleId}`)
  },
}
