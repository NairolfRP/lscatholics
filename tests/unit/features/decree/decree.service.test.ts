import type { APIMessage, APIPublicThreadChannel, APIThreadMetadata } from 'discord-api-types/v10'
import { HTTPError } from 'ky'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  DECREE_FORUM_TAG_ID,
  DECREES_CHANNEL_ID,
} from '#/features/decree/constants/decree.constants.ts'
import { getDecree, getDecrees } from '#/features/decree/server/decree.service.ts'

const discordApi = vi.hoisted(() => ({
  fetchArchivedPublicThreads: vi.fn(),
  fetchDiscordChannel: vi.fn(),
  fetchChannelMessages: vi.fn(),
}))

vi.mock('#/features/decree/server/discord.api.ts', () => discordApi)

function makeThreadMetadata(createTimestamp: string): APIThreadMetadata {
  return {
    archived: true,
    auto_archive_duration: 10080,
    archive_timestamp: createTimestamp,
    create_timestamp: createTimestamp,
    locked: false,
  }
}

function makeThread(
  id: string,
  overrides: Partial<APIPublicThreadChannel> = {}
): APIPublicThreadChannel {
  return {
    id,
    type: 11,
    parent_id: DECREES_CHANNEL_ID,
    name: `Décret ${id}`,
    applied_tags: [DECREE_FORUM_TAG_ID.EXECUTIVE, DECREE_FORUM_TAG_ID.ENACTED],
    thread_metadata: makeThreadMetadata('2026-01-01T00:00:00.000Z'),
    ...overrides,
  }
}

function makeEmbed(overrides: Record<string, unknown> = {}) {
  return {
    description: '**Texte du décret**\nParagraphe de contenu.',
    timestamp: '2026-02-01T00:00:00.000Z',
    image: { url: 'https://cdn.example/seal.webp' },
    fields: [
      { name: 'Référence', value: 'DEC-2026-001', inline: true },
      { name: 'Auteur', value: 'Mgr Nairolf', inline: true },
    ],
    ...overrides,
  }
}

function makeMessage(overrides: Partial<APIMessage> = {}): APIMessage {
  return { id: 'msg-1', embeds: [makeEmbed()], ...overrides } as APIMessage
}

function httpError(status: number) {
  return new HTTPError(
    new Response('', { status }),
    new Request('https://discord.com/api/v10/channels/123'),
    {} as never
  )
}

beforeEach(() => {
  discordApi.fetchArchivedPublicThreads.mockReset()
  discordApi.fetchDiscordChannel.mockReset()
  discordApi.fetchChannelMessages.mockReset()
})

describe('getDecrees', () => {
  it('groups publishable threads by category in the canonical order', async () => {
    discordApi.fetchArchivedPublicThreads.mockResolvedValue([
      makeThread('10000000000000000001', {
        name: 'Décret exécutif',
        applied_tags: [DECREE_FORUM_TAG_ID.EXECUTIVE, DECREE_FORUM_TAG_ID.ENACTED],
      }),
      makeThread('10000000000000000002', {
        name: 'Loi canonique',
        applied_tags: [DECREE_FORUM_TAG_ID.LEGISLATIVE, DECREE_FORUM_TAG_ID.ENACTED],
      }),
      makeThread('10000000000000000003', {
        name: 'Acte administratif',
        applied_tags: [DECREE_FORUM_TAG_ID.ADMINISTRATIVE],
      }),
      makeThread('10000000000000000004', {
        name: 'Jugement',
        applied_tags: [DECREE_FORUM_TAG_ID.JUDICIARY],
      }),
    ])

    const result = await getDecrees()

    expect(discordApi.fetchArchivedPublicThreads).toHaveBeenCalledWith(DECREES_CHANNEL_ID)
    expect(result.total).toBe(4)
    expect(result.categories.executive[0].title).toBe('Décret exécutif')
    expect(result.categories.law[0].title).toBe('Loi canonique')
    expect(result.categories.administrative[0].title).toBe('Acte administratif')
    expect(result.categories.judicial[0].title).toBe('Jugement')
  })

  it('filters out threads without a category tag', async () => {
    discordApi.fetchArchivedPublicThreads.mockResolvedValue([
      makeThread('10000000000000000001', { applied_tags: [DECREE_FORUM_TAG_ID.ENACTED] }),
    ])

    const result = await getDecrees()

    expect(result.total).toBe(0)
  })

  it('filters out ignored threads even when enacted', async () => {
    discordApi.fetchArchivedPublicThreads.mockResolvedValue([
      makeThread('10000000000000000001', {
        applied_tags: [
          DECREE_FORUM_TAG_ID.EXECUTIVE,
          DECREE_FORUM_TAG_ID.ENACTED,
          DECREE_FORUM_TAG_ID.REPEALED_OR_EXPIRED,
        ],
      }),
    ])

    const result = await getDecrees()

    expect(result.total).toBe(0)
  })

  it('hides not-yet-enacted executive and legislative decrees', async () => {
    discordApi.fetchArchivedPublicThreads.mockResolvedValue([
      makeThread('10000000000000000001', {
        applied_tags: [DECREE_FORUM_TAG_ID.EXECUTIVE],
      }),
      makeThread('10000000000000000002', {
        applied_tags: [DECREE_FORUM_TAG_ID.LEGISLATIVE],
      }),
      makeThread('10000000000000000003', {
        applied_tags: [DECREE_FORUM_TAG_ID.ADMINISTRATIVE],
      }),
    ])

    const result = await getDecrees()

    expect(result.total).toBe(1)
    expect(result.categories.administrative).toHaveLength(1)
    expect(result.categories.executive).toHaveLength(0)
    expect(result.categories.law).toHaveLength(0)
  })

  it('sorts each category by published date descending', async () => {
    discordApi.fetchArchivedPublicThreads.mockResolvedValue([
      makeThread('10000000000000000001', {
        thread_metadata: makeThreadMetadata('2026-01-01T00:00:00.000Z'),
      }),
      makeThread('10000000000000000002', {
        thread_metadata: makeThreadMetadata('2026-03-01T00:00:00.000Z'),
      }),
      makeThread('10000000000000000003', {
        thread_metadata: makeThreadMetadata('2026-02-01T00:00:00.000Z'),
      }),
    ])

    const result = await getDecrees()

    expect(result.categories.executive.map((item) => item.publishedAt)).toEqual([
      '2026-03-01T00:00:00.000Z',
      '2026-02-01T00:00:00.000Z',
      '2026-01-01T00:00:00.000Z',
    ])
  })

  it('propagates upstream errors', async () => {
    discordApi.fetchArchivedPublicThreads.mockRejectedValue(new Error('network down'))

    await expect(getDecrees()).rejects.toThrow('network down')
  })
})

describe('getDecree', () => {
  it('returns the decree detail built from the embed', async () => {
    discordApi.fetchDiscordChannel.mockResolvedValue(
      makeThread('10000000000000000001', {
        name: 'Décret exécutif',
        applied_tags: [DECREE_FORUM_TAG_ID.EXECUTIVE, DECREE_FORUM_TAG_ID.ENACTED],
      })
    )
    discordApi.fetchChannelMessages.mockResolvedValue([makeMessage()])

    const detail = await getDecree({ threadId: '10000000000000000001' })

    expect(detail?.decree).toMatchObject({
      threadId: '10000000000000000001',
      title: 'Décret exécutif',
      slug: 'decret-executif',
      description: '**Texte du décret**\nParagraphe de contenu.',
      publishedAt: '2026-02-01T00:00:00.000Z',
      image: 'https://cdn.example/seal.webp',
      category: 'executive',
      isEnacted: true,
      isInEffect: false,
    })
    expect(detail?.decree.fields).toEqual([
      { name: 'Référence', value: 'DEC-2026-001' },
      { name: 'Auteur', value: 'Mgr Nairolf' },
    ])
    expect(detail?.canonicalUid).toBe('10000000000000000001-decret-executif')
    expect(discordApi.fetchDiscordChannel).toHaveBeenCalledWith('10000000000000000001')
    expect(discordApi.fetchChannelMessages).toHaveBeenCalledWith('10000000000000000001')
  })

  it('returns null when the channel does not belong to the decrees forum', async () => {
    discordApi.fetchDiscordChannel.mockResolvedValue(
      makeThread('10000000000000000001', { parent_id: 'other-channel' })
    )
    discordApi.fetchChannelMessages.mockResolvedValue([makeMessage()])

    await expect(getDecree({ threadId: '10000000000000000001' })).resolves.toBeNull()
  })

  it('returns null when the thread has no category tag', async () => {
    discordApi.fetchDiscordChannel.mockResolvedValue(
      makeThread('10000000000000000001', { applied_tags: [DECREE_FORUM_TAG_ID.ENACTED] })
    )
    discordApi.fetchChannelMessages.mockResolvedValue([makeMessage()])

    await expect(getDecree({ threadId: '10000000000000000001' })).resolves.toBeNull()
  })

  it('returns null when the thread is not publishable', async () => {
    discordApi.fetchDiscordChannel.mockResolvedValue(
      makeThread('10000000000000000001', { applied_tags: [DECREE_FORUM_TAG_ID.EXECUTIVE] })
    )
    discordApi.fetchChannelMessages.mockResolvedValue([makeMessage()])

    await expect(getDecree({ threadId: '10000000000000000001' })).resolves.toBeNull()
  })

  it('returns null when the first message has no embed', async () => {
    discordApi.fetchDiscordChannel.mockResolvedValue(
      makeThread('10000000000000000001', {
        applied_tags: [DECREE_FORUM_TAG_ID.EXECUTIVE, DECREE_FORUM_TAG_ID.ENACTED],
      })
    )
    discordApi.fetchChannelMessages.mockResolvedValue([makeMessage({ embeds: [] })])

    await expect(getDecree({ threadId: '10000000000000000001' })).resolves.toBeNull()
  })

  it('returns null when Discord responds with 404', async () => {
    discordApi.fetchDiscordChannel.mockRejectedValue(httpError(404))

    await expect(getDecree({ threadId: '10000000000000000001' })).resolves.toBeNull()
  })

  it('rethrows non-404 errors', async () => {
    discordApi.fetchDiscordChannel.mockRejectedValue(httpError(500))

    await expect(getDecree({ threadId: '10000000000000000001' })).rejects.toBeInstanceOf(HTTPError)
  })
})
