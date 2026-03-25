import string from '@adonisjs/core/helpers/string'
import env from '#start/env'
import type { DiscordChannelMessages } from '#discord/types/interfaces/entities/discord_channel'
import type {
  DiscordChannelThreadsArchivedPublicResponse,
  DiscordPublicThreadChannel,
} from '#discord/types/interfaces/entities/discord_channel_threads'

const CATEGORY_TAGS = {
  '1253567271410864178': 'executive',
  '1253567318722613319': 'law',
  '1253567373227724891': 'administrative',
  '1253567421843902484': 'judicial',
} as const

type Category = (typeof CATEGORY_TAGS)[keyof typeof CATEGORY_TAGS]
type CategorizedThreads = Record<Category, Array<{ uid: string; title: string; tags: string[] }>>

export default class DecreesService {
  #BASE_URL = 'https://discord.com/api/v10'

  #channelId = '1253466164294582332'

  #ignoredTags = ['1253567595970301992', '1415400158560256111']

  #enforceableTags = ['1253567271410864178', '1253567318722613319']

  #enactedTag = '1253567512705237033'

  #effectiveTag = '1253567463568965714'

  async getDecrees() {
    try {
      const url = `${this.#BASE_URL}/channels/${this.#channelId}/threads/archived/public`

      const query = await fetch(url, {
        headers: {
          Authorization: `Bot ${env.get('DISCORD_BOT_TOKEN')}`,
          Accept: 'application/json',
        },
      })

      if (!query.ok) {
        throw new Error(
          `Failed to fetch decrees with status: ${query.status} - ${query.statusText}`
        )
      }

      const res = (await query.json()) as DiscordChannelThreadsArchivedPublicResponse

      return (res.threads as DiscordPublicThreadChannel[])
        .filter(({ applied_tags: tags = [] }) => {
          if (tags.some((t) => this.#ignoredTags.includes(t))) return false
          if (tags.some((t) => this.#enforceableTags.includes(t)))
            return tags.some((t) => [this.#enactedTag, this.#effectiveTag].includes(t))
          return true
        })
        .sort((a, b) =>
          a.thread_metadata!.create_timestamp! > b.thread_metadata!.create_timestamp! ? -1 : 1
        )
        .map((thread) => ({
          uid: `${thread.id}-${this.#slugify(thread.name)}`,
          title: thread.name,
          tags: thread.applied_tags ?? [],
        }))
    } catch {
      return []
    }
  }

  async getSingleDecree(threadId: string) {
    try {
      const url = `${this.#BASE_URL}/channels/${threadId}/messages`

      const query = await fetch(url, {
        headers: {
          Authorization: `Bot ${env.get('DISCORD_BOT_TOKEN')}`,
          Accept: 'application/json',
        },
      })

      if (!query.ok) {
        throw new Error(
          `Failed to fetch decree with thread id '${threadId}'. Status: ${query.status} - ${query.statusText}`
        )
      }

      return (await query.json()) as DiscordChannelMessages
    } catch {
      return null
    }
  }

  sortDecreesByCategories(decrees: Array<{ uid: string; title: string; tags: string[] }>) {
    return decrees.reduce(
      (acc, thread) => {
        const category = thread.tags
          ?.map((t) => CATEGORY_TAGS[t as keyof typeof CATEGORY_TAGS])
          .find(Boolean)

        if (category) acc[category].push(thread)
        return acc
      },
      { executive: [], law: [], administrative: [], judicial: [] } as CategorizedThreads
    )
  }

  #slugify(title: string) {
    return string.slug(title, {
      lower: true,
      trim: true,
      strict: true,
    })
  }
}
