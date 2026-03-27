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
    const res = await fetch(url, { headers })
    if (!res.ok) throw new Error(`Discord API error: ${res.status} on ${path}`)
    return (await res.json()) as Promise<T>
  }

  #getHeaders(): HeadersInit {
    const discordBotToken = env.get('DISCORD_BOT_TOKEN')

    return {
      Authorization: `Bot ${discordBotToken}`,
      Accept: 'application/json',
    }
  }
}
