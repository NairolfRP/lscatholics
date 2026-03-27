import string from '@adonisjs/core/helpers/string'
import DiscordChannelService from '#discord/services/discord_channel_service'

const CATEGORY_TAGS = {
  '1253567271410864178': 'executive',
  '1253567318722613319': 'law',
  '1253567373227724891': 'administrative',
  '1253567421843902484': 'judicial',
} as const

type Category = (typeof CATEGORY_TAGS)[keyof typeof CATEGORY_TAGS]
type CategorizedThreads = Record<Category, Array<{ uid: string; title: string; tags: string[] }>>

export default class DecreesService {
  #channelId = '1253466164294582332'

  #ignoredTags = ['1253567595970301992', '1415400158560256111']

  #enforceableTags = ['1253567271410864178', '1253567318722613319']

  #enactedTag = '1253567512705237033'

  #effectiveTag = '1253567463568965714'

  async getDecrees() {
    try {
      const threads = await DiscordChannelService.create({
        channelId: this.#channelId,
      }).getArchivedPublicThreads()

      return threads
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
      const [channel, messages] = await DiscordChannelService.create({
        channelId: threadId,
      }).getThreadAndMessages()

      if (!channel || !messages || messages.length === 0 || messages[0].embeds.length === 0) {
        throw new Error(
          'Failed to get decree - probably an invalid thread id or the message is invalid (not embedded)'
        )
      }

      const title = channel.name
      const embed = messages[0].embeds[0]
      const tags = channel.applied_tags ?? []

      const isEnforceable = this.#isEnforceable(tags)
      const isEnacted = isEnforceable ? this.#isEnacted(tags) : false
      const isInEffect = isEnforceable ? this.#isInEffect(tags) : false

      return {
        decree: {
          title,
          slug: this.#slugify(title),
          description: embed.description ?? '',
          timestamp: embed.timestamp,
          image: embed.image?.url,
          fields: embed.fields ?? [],
        },
        metadata: { isEnforceable, isEnacted, isInEffect },
      }
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

  #isEnforceable(value: string | string[]) {
    if (typeof value === 'string') {
      return this.#enforceableTags.includes(value)
    }

    return value.some((tag) => this.#enforceableTags.includes(tag))
  }

  #isEnacted(tags: string[]) {
    return tags.includes(this.#enactedTag)
  }

  #isInEffect(tags: string[]) {
    return tags.includes(this.#effectiveTag)
  }
}
