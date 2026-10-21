import type { APIMessage, APIPublicThreadChannel } from 'discord-api-types/v10'
import { HTTPError } from 'ky'
import type { DecreeCategory } from '#/features/decree/constants/decree.constants.ts'
import {
  DECREE_SUMMARY_MAX_LENGTH,
  DECREES_CHANNEL_ID,
} from '#/features/decree/constants/decree.constants.ts'
import { mapMessageComponents } from '#/features/decree/server/decree-components.ts'
import {
  fetchArchivedPublicThreads,
  fetchChannelMessages,
  fetchDiscordChannel,
} from '#/features/decree/server/discord.api.ts'
import type {
  Decree,
  DecreeBlock,
  DecreeDetail,
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
import { handleServiceError } from '#server/exceptions/service-error.ts'

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
    handleServiceError(err, {}, 'Failed to fetch decrees from Discord')
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

    handleServiceError(err, { threadId }, 'Failed to fetch decree from Discord')
  }
}

function toListItem(thread: APIPublicThreadChannel, category: DecreeCategory): DecreeListItem {
  return {
    uid: buildDecreeUid(thread.id, thread.name),
    threadId: thread.id,
    title: thread.name,
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

  if (messages.length === 0) return null

  const message = messages[0]
  const blocks = toBlocks(message)
  if (blocks.length === 0) return null

  const title = channel.name
  const decree: Decree = {
    threadId: channel.id,
    uid: buildDecreeUid(channel.id, title),
    title,
    slug: slugifyTitle(title),
    publishedAt: message.timestamp || channel.thread_metadata?.create_timestamp || null,
    blocks,
    description: buildSummary(blocks),
    image: findFirstMediaUrl(blocks),
    category,
    isEnacted: isDecreeEnacted(tags),
    isInEffect: isDecreeInEffect(tags),
  }

  return { decree, canonicalUid: decree.uid }
}

/** The message content comes first, then the components v2 tree. */
function toBlocks(message: APIMessage): DecreeBlock[] {
  const blocks = mapMessageComponents(message.components ?? [])
  const content = message.content.trim()

  if (content.length === 0) return blocks
  return [{ kind: 'text', content: message.content }, ...blocks]
}

/** Plain-text summary of the decree, used for SEO metadata. */
function buildSummary(blocks: DecreeBlock[]): string {
  const text = blocks
    .map((block) => (block.kind === 'text' || block.kind === 'section' ? block.content : ''))
    .join(' ')

  const plain = text
    .replace(/!\[[^\]]*]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)]\([^)]*\)/g, '$1')
    .replace(/[*_~`>#]/g, '')
    .replace(/\s+/g, ' ')
    .trim()

  if (plain.length <= DECREE_SUMMARY_MAX_LENGTH) return plain
  return `${plain.slice(0, DECREE_SUMMARY_MAX_LENGTH).trimEnd()}…`
}

function findFirstMediaUrl(blocks: DecreeBlock[]): string | null {
  for (const block of blocks) {
    if (block.kind === 'media') {
      const first = block.items.at(0)
      if (first) return first.url
    }

    if (block.kind === 'section' && block.accessory) {
      return block.accessory.url
    }
  }

  return null
}
