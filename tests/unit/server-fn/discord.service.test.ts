import { beforeEach, describe, expect, it, vi } from 'vitest'
import { discordBotClient, sendWebhookMessage } from '#server/services/discord.service.ts'

const postMock = vi.hoisted(() => vi.fn<(url: string, options?: unknown) => Promise<unknown>>())
const createMock = vi.hoisted(() => vi.fn<(options: unknown) => void>())
const botInstance = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
}))

vi.mock('ky', () => ({
  default: {
    post: postMock,
    create: (options: unknown) => {
      createMock(options)
      return botInstance
    },
  },
}))

function jsonResponse(value: unknown) {
  return { json: vi.fn().mockResolvedValue(value) }
}

const WEBHOOK_URL = 'https://discord.com/api/webhooks/id/token'

beforeEach(() => {
  postMock.mockReset()
  createMock.mockReset()
  botInstance.get.mockReset()
  botInstance.post.mockReset()
  botInstance.put.mockReset()
  botInstance.delete.mockReset()
})

describe('sendWebhookMessage', () => {
  it('posts the JSON payload to the webhook url', async () => {
    postMock.mockResolvedValue({})

    await sendWebhookMessage({
      url: WEBHOOK_URL,
      payload: { content: 'Hello', embeds: [{ title: 'Embed' }] },
    })

    expect(postMock).toHaveBeenCalledWith(
      WEBHOOK_URL,
      expect.objectContaining({
        json: { content: 'Hello', embeds: [{ title: 'Embed' }] },
        searchParams: { wait: false },
        retry: 0,
      })
    )
  })

  it('returns the created message when wait is enabled', async () => {
    const message = { id: '1', content: 'Hello' }
    postMock.mockResolvedValue(jsonResponse(message))

    const result = await sendWebhookMessage({
      url: WEBHOOK_URL,
      payload: { content: 'Hello' },
      wait: true,
    })

    expect(result).toEqual(message)
  })

  it('sends thread_id and with_components as search params', async () => {
    postMock.mockResolvedValue({})

    await sendWebhookMessage({
      url: WEBHOOK_URL,
      payload: { content: 'Hello' },
      threadId: '123',
      withComponents: true,
    })

    expect(postMock).toHaveBeenCalledWith(
      WEBHOOK_URL,
      expect.objectContaining({
        searchParams: { wait: false, thread_id: '123', with_components: true },
      })
    )
  })

  it('sends the payload as multipart form data when files are provided', async () => {
    postMock.mockResolvedValue({})

    await sendWebhookMessage({
      url: WEBHOOK_URL,
      payload: { content: 'With file' },
      files: [{ name: 'report.png', data: new Blob(['png']), contentType: 'image/png' }],
    })

    const options = postMock.mock.calls[0][1] as { body: FormData }
    expect(options.body).toBeInstanceOf(FormData)
    expect(JSON.parse(options.body.get('payload_json') as string)).toEqual({ content: 'With file' })
    expect(options.body.get('files[0]')).toBeInstanceOf(File)
  })

  it('propagates request errors', async () => {
    postMock.mockRejectedValue(new Error('boom'))

    await expect(
      sendWebhookMessage({ url: WEBHOOK_URL, payload: { content: 'Hello' } })
    ).rejects.toThrow('boom')
  })
})

describe('discordBotClient', () => {
  it('sends a message to a channel with the bot token', async () => {
    const message = { id: 'msg-1', content: 'Hi' }
    botInstance.post.mockReturnValue(jsonResponse(message))

    const result = await discordBotClient.sendChannelMessage({
      channelId: '123',
      payload: { content: 'Hi' },
    })

    expect(botInstance.post).toHaveBeenCalledWith('channels/123/messages', {
      json: { content: 'Hi' },
    })
    expect(result).toEqual(message)
    expect(createMock).toHaveBeenCalledWith(
      expect.objectContaining({
        prefix: 'https://discord.com/api/v10',
        headers: { Authorization: 'Bot fake-discord-bot-token' },
      })
    )
  })

  it('fetches a guild member', async () => {
    const member = { user: { id: '2' } }
    botInstance.get.mockReturnValue(jsonResponse(member))

    const result = await discordBotClient.getGuildMember({ guildId: '1', userId: '2' })

    expect(botInstance.get).toHaveBeenCalledWith('guilds/1/members/2')
    expect(result).toEqual(member)
  })

  it('adds a role to a guild member', async () => {
    await discordBotClient.addGuildMemberRole({ guildId: '1', userId: '2', roleId: '3' })

    expect(botInstance.put).toHaveBeenCalledWith('guilds/1/members/2/roles/3')
  })

  it('removes a role from a guild member', async () => {
    await discordBotClient.removeGuildMemberRole({ guildId: '1', userId: '2', roleId: '3' })

    expect(botInstance.delete).toHaveBeenCalledWith('guilds/1/members/2/roles/3')
  })
})
