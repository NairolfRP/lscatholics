import type {
  APIMessage,
  APIPublicThreadChannel,
  RESTGetAPIChannelThreadsArchivedPublicResult,
  Snowflake,
} from 'discord-api-types/v10'
import ky from 'ky'
import { env } from '#/config/env.server.ts'

const DISCORD_API_BASE_URL = 'https://discord.com/api/v10'
const REQUEST_TIMEOUT = 10_000

const discordClient = ky.create({
  prefix: DISCORD_API_BASE_URL,
  timeout: REQUEST_TIMEOUT,
  retry: 2,
  headers: {
    Authorization: `Bot ${env.DISCORD_BOT_TOKEN}`,
  },
})

/** Archived public threads of a forum channel (newest first). */
export async function fetchArchivedPublicThreads(
  channelId: Snowflake
): Promise<APIPublicThreadChannel[]> {
  const response = await discordClient
    .get(`channels/${channelId}/threads/archived/public`)
    .json<RESTGetAPIChannelThreadsArchivedPublicResult>()

  return response.threads as APIPublicThreadChannel[]
}

/** A single channel/thread object. */
export async function fetchDiscordChannel(channelId: Snowflake): Promise<APIPublicThreadChannel> {
  return discordClient.get(`channels/${channelId}`).json<APIPublicThreadChannel>()
}

/** Most recent messages of a channel, newest first. */
export async function fetchChannelMessages(channelId: Snowflake): Promise<APIMessage[]> {
  return discordClient.get(`channels/${channelId}/messages`).json<APIMessage[]>()
}
