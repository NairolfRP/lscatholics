import type { APIEmbedField, APIMessage, APIPublicThreadChannel } from 'discord-api-types/v10'
import { HTTPError } from 'ky'
import type { DecreeCategory } from '#/features/decree/constants/decree.constants.ts'
import { DECREES_CHANNEL_ID } from '#/features/decree/constants/decree.constants.ts'
import {
  fetchArchivedPublicThreads,
  fetchChannelMessages,
  fetchDiscordChannel,
} from '#/features/decree/server/discord.api.ts'
import type {
  Decree,
  DecreeDetail,
  DecreeField,
  DecreeListItem,
  DecreesIndex,
} from '#/features/decree/types/decree.types.ts'
import {
  buildDecreeUid,
  compareByDateDesc,
  getThreadCategory,
  isDecreeEnacted,
  isDecreeInEffect,
  isThreadPublishable,
  slugifyTitle,
} from '#/features/decree/utils/decree.utils.ts'
import { logger } from '#server/integrations/logger.ts'

export async function getDecrees(): Promise<DecreesIndex> {
  try {
    const threads = await fetchArchivedPublicThreads(DECREES_CHANNEL_ID)

    const items = threads
      .flatMap((thread): DecreeListItem[] => {
        const tags = thread.applied_tags ?? []
        const category = getThreadCategory(tags)
        if (category === null || !isThreadPublishable(tags)) return []
        return [toListItem(thread, category)]
      })
      .sort((a, b) => compareByDateDesc(a.publishedAt, b.publishedAt))

    const categories = {
      executive: [],
      law: [],
      administrative: [],
      judicial: [],
    } satisfies Record<DecreeCategory, DecreeListItem[]>

    for (const item of items) {
      categories[item.category].push(item as never)
    }

    return { categories, total: items.length }
  } catch (err) {
    logger.error({ err }, 'Failed to fetch decrees from Discord')
    throw err
  }
}

export async function getDecree({ threadId }: { threadId: string }): Promise<DecreeDetail | null> {
  try {
    const [channel, messages] = await Promise.all([
      fetchDiscordChannel(threadId),
      fetchChannelMessages(threadId),
    ])

    return toDecreeDetail(channel, messages)
  } catch (err) {
    if (err instanceof HTTPError && err.response.status === 404) return null

    logger.error({ err, threadId }, 'Failed to fetch decree from Discord')
    throw err
  }
}

function toListItem(thread: APIPublicThreadChannel, category: DecreeCategory): DecreeListItem {
  return {
    uid: buildDecreeUid(thread.id, thread.name ?? 'Décret'),
    threadId: thread.id,
    title: thread.name ?? 'Décret',
    category,
    publishedAt: thread.thread_metadata?.create_timestamp ?? null,
  }
}

function toDecreeDetail(
  channel: APIPublicThreadChannel,
  messages: APIMessage[]
): DecreeDetail | null {
  const tags = channel.applied_tags ?? []
  const category = getThreadCategory(tags)

  // Only expose threads that belong to the decrees forum and are publishable. This also
  // prevents the bot token from being used to read arbitrary channels.
  if (channel.parent_id !== DECREES_CHANNEL_ID || category === null || !isThreadPublishable(tags)) {
    return null
  }

  const embed = messages[0]?.embeds[0]
  if (!embed) return null

  const title = channel.name ?? 'Décret'
  const decree: Decree = {
    threadId: channel.id,
    uid: buildDecreeUid(channel.id, title),
    title,
    slug: slugifyTitle(title),
    description: embed.description ?? '',
    publishedAt: embed.timestamp ?? null,
    image: embed.image?.url ?? null,
    fields: (embed.fields ?? []).map(toDecreeField),
    category,
    isEnacted: isDecreeEnacted(tags),
    isInEffect: isDecreeInEffect(tags),
  }

  return { decree, canonicalUid: decree.uid }
}

function toDecreeField(field: APIEmbedField): DecreeField {
  return { name: field.name, value: field.value }
}
