import type {
  APIMessage,
  APIMessageTopLevelComponent,
  APIPublicThreadChannel,
  APIThreadMetadata,
} from 'discord-api-types/v10'
import { ComponentType, SeparatorSpacingSize } from 'discord-api-types/v10'
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

/** Mirrors the components v2 payload Discord returns for a decree. */
function makeComponents(): APIMessageTopLevelComponent[] {
  return [
    { type: ComponentType.TextDisplay, id: 1, content: '<@&1071282941826703370>' },
    {
      type: ComponentType.Container,
      id: 2,
      accent_color: 15481602,
      components: [
        {
          type: ComponentType.MediaGallery,
          id: 3,
          items: [
            {
              media: {
                url: 'https://i.imgur.com/TF09sUC.png',
                width: 500,
                height: 533,
              },
              description: null,
              spoiler: false,
            },
          ],
        },
        {
          type: ComponentType.Separator,
          id: 4,
          divider: true,
          spacing: SeparatorSpacingSize.Small,
        },
        {
          type: ComponentType.TextDisplay,
          id: 5,
          content: '**NOS, EDMUNDUS MICHAEL CARDINALUS HENNESSY,**',
        },
        {
          type: ComponentType.Separator,
          id: 6,
          divider: true,
          spacing: SeparatorSpacingSize.Small,
        },
        {
          type: ComponentType.TextDisplay,
          id: 7,
          content: '**ARTICLE 1** — Aucun sacrement de mariage.',
        },
        {
          type: ComponentType.Separator,
          id: 8,
          divider: true,
          spacing: SeparatorSpacingSize.Large,
        },
        {
          type: ComponentType.Section,
          id: 9,
          components: [
            {
              type: ComponentType.TextDisplay,
              id: 10,
              content: '+Edmund cardinal HENNESSY\narchevêque de Los Santos',
            },
          ],
          accessory: {
            type: ComponentType.Thumbnail,
            id: 11,
            media: {
              url: 'https://i.imgur.com/TEbG0MA.png',
              width: 1235,
              height: 1274,
            },
            description: null,
            spoiler: false,
          },
        },
        {
          type: ComponentType.Section,
          id: 12,
          components: [
            {
              type: ComponentType.TextDisplay,
              id: 13,
              content: '*Contressigné par le Chancelier*',
            },
          ],
          accessory: {
            type: ComponentType.Thumbnail,
            id: 14,
            media: {
              url: 'https://i.imgur.com/oZFIoyO.png',
              width: 1264,
              height: 1244,
            },
            description: null,
            spoiler: false,
          },
        },
      ],
    },
  ]
}

function makeMessage(overrides: Partial<APIMessage> = {}): APIMessage {
  return {
    id: 'msg-1',
    content: '',
    embeds: [],
    components: makeComponents(),
    timestamp: '2026-02-01T00:00:00.000Z',
    ...overrides,
  } as APIMessage
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

  it('sanitizes upstream errors', async () => {
    discordApi.fetchArchivedPublicThreads.mockRejectedValue(new Error('network down'))

    await expect(getDecrees()).rejects.toThrow('Internal error')
  })
})

describe('getDecree', () => {
  it('returns the decree detail built from the components', async () => {
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
      publishedAt: '2026-02-01T00:00:00.000Z',
      image: 'https://i.imgur.com/TF09sUC.png',
      category: 'executive',
      isEnacted: true,
      isInEffect: false,
    })
    expect(detail?.decree.blocks).toEqual([
      {
        kind: 'media',
        items: [
          {
            url: 'https://i.imgur.com/TF09sUC.png',
            description: null,
            width: 500,
            height: 533,
          },
        ],
      },
      { kind: 'separator', divider: true, spacing: 'small' },
      { kind: 'text', content: '**NOS, EDMUNDUS MICHAEL CARDINALUS HENNESSY,**' },
      { kind: 'separator', divider: true, spacing: 'small' },
      { kind: 'text', content: '**ARTICLE 1** — Aucun sacrement de mariage.' },
      { kind: 'separator', divider: true, spacing: 'large' },
      {
        kind: 'section',
        content: '+Edmund cardinal HENNESSY\narchevêque de Los Santos',
        accessory: {
          url: 'https://i.imgur.com/TEbG0MA.png',
          description: null,
          width: 1235,
          height: 1274,
        },
      },
      {
        kind: 'section',
        content: '*Contressigné par le Chancelier*',
        accessory: {
          url: 'https://i.imgur.com/oZFIoyO.png',
          description: null,
          width: 1264,
          height: 1244,
        },
      },
    ])
    expect(detail?.decree.description).toBe(
      'NOS, EDMUNDUS MICHAEL CARDINALUS HENNESSY, ARTICLE 1 — Aucun sacrement de mariage. ' +
        '+Edmund cardinal HENNESSY archevêque de Los Santos Contressigné par le Chancelier'
    )
    expect(detail?.canonicalUid).toBe('10000000000000000001-decret-executif')
    expect(discordApi.fetchDiscordChannel).toHaveBeenCalledWith('10000000000000000001')
    expect(discordApi.fetchChannelMessages).toHaveBeenCalledWith('10000000000000000001')
  })

  it('exposes the message content as the first block', async () => {
    discordApi.fetchDiscordChannel.mockResolvedValue(
      makeThread('10000000000000000001', {
        applied_tags: [DECREE_FORUM_TAG_ID.EXECUTIVE, DECREE_FORUM_TAG_ID.ENACTED],
      })
    )
    discordApi.fetchChannelMessages.mockResolvedValue([
      makeMessage({ content: 'Contenu du message', components: [] }),
    ])

    const detail = await getDecree({ threadId: '10000000000000000001' })

    expect(detail?.decree.blocks).toEqual([{ kind: 'text', content: 'Contenu du message' }])
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

  it('returns null when the first message has no component', async () => {
    discordApi.fetchDiscordChannel.mockResolvedValue(
      makeThread('10000000000000000001', {
        applied_tags: [DECREE_FORUM_TAG_ID.EXECUTIVE, DECREE_FORUM_TAG_ID.ENACTED],
      })
    )
    discordApi.fetchChannelMessages.mockResolvedValue([makeMessage({ components: [] })])

    await expect(getDecree({ threadId: '10000000000000000001' })).resolves.toBeNull()
  })

  it('returns null for legacy embed-only messages', async () => {
    discordApi.fetchDiscordChannel.mockResolvedValue(
      makeThread('10000000000000000001', {
        applied_tags: [DECREE_FORUM_TAG_ID.EXECUTIVE, DECREE_FORUM_TAG_ID.ENACTED],
      })
    )
    discordApi.fetchChannelMessages.mockResolvedValue([
      makeMessage({
        components: [],
        embeds: [{ description: 'Ancien format', timestamp: '2026-02-01T00:00:00.000Z' }],
      }),
    ])

    await expect(getDecree({ threadId: '10000000000000000001' })).resolves.toBeNull()
  })

  it('returns null when Discord responds with 404', async () => {
    discordApi.fetchDiscordChannel.mockRejectedValue(httpError(404))

    await expect(getDecree({ threadId: '10000000000000000001' })).resolves.toBeNull()
  })

  it('sanitizes non-404 errors', async () => {
    discordApi.fetchDiscordChannel.mockRejectedValue(httpError(500))

    await expect(getDecree({ threadId: '10000000000000000001' })).rejects.toThrow('Internal error')
  })
})
