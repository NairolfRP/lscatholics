import type { HeadersInit } from '#app/shared/types/utils.types'
import env from '#start/env'
import type {
  DiscordChannelThreadsArchivedPublicResponse,
  DiscordPublicThreadChannel,
} from '#discord/types/interfaces/entities/discord_channel_threads'
import type {
  DiscordChannel,
  DiscordChannelMessages,
} from '#discord/types/interfaces/entities/discord_channel'
import ky, { isHTTPError } from 'ky'

type DiscordChannelProps = { channelId: string }

export default class DiscordChannelService {
  readonly #baseUrl = 'https://discord.com/api/v10'

  readonly channelId: string

  protected constructor({ channelId }: DiscordChannelProps) {
    this.channelId = channelId
  }

  static create({ channelId }: DiscordChannelProps) {
    return new DiscordChannelService({ channelId })
  }

  async getChannel() {
    const channelId = this.channelId

    return await this.#fetch<DiscordChannel>(`/channels/${channelId}`)
  }

  async getMessages() {
    const channelId = this.channelId

    return await this.#fetch<DiscordChannelMessages>(`/channels/${channelId}/messages`)
  }

  async getThread() {
    return (await this.getChannel()) as DiscordPublicThreadChannel
  }

  async getThreadAndMessages() {
    return Promise.all([this.getThread(), this.getMessages()])
  }

  async getArchivedPublicThreads() {
    const channelId = this.channelId

    const { threads } = await this.#fetch<DiscordChannelThreadsArchivedPublicResponse>(
      `/channels/${channelId}/threads/archived/public`
    )

    return threads as DiscordPublicThreadChannel[]
  }

  async #fetch<T>(path: string): Promise<T> {
    const url = `${this.#baseUrl}${path}`
    const headers = this.#getHeaders()
    try {
      return await ky.get(url, { retry: { limit: 3 }, headers }).json<Promise<T>>()
    } catch (error) {
      if (isHTTPError(error)) {
        throw new Error(`Discord API error: ${error.response.status} on ${path}`)
      }
      throw error
    }
  }

  #getHeaders(): HeadersInit {
    const discordBotToken = env.get('DISCORD_BOT_TOKEN')

    return {
      Authorization: `Bot ${discordBotToken}`,
      Accept: 'application/json',
    }
  }
}
