import { test } from '@japa/runner'
import nock from 'nock'
import {
  DiscordWebhookOptions,
  DiscordWebhookService,
} from '#discord/services/discord_webhook_service'
import DiscordWebhookException from '#discord/exceptions/discord_webhook_exception'

const VALID_WEBHOOK_URL = 'https://discord.com/api/webhooks/123456789/abcdef'
const INVALID_WEBHOOK_URL = 'invalid-url'
const WEBHOOK_PATH = '/webhooks/123456789/abcdef'

const SAMPLE_EMBED = {
  title: 'Test Embed',
  description: 'Test Description',
  color: 0x00ff00,
}

const LARGE_EMBED = {
  title: 'a'.repeat(300),
  description: 'b'.repeat(5000),
}

const EMBED_WITH_TOO_MANY_FIELDS = {
  title: 'Too Many Fields',
  fields: Array.from({ length: 26 }, (_, i) => ({
    name: `Field ${i + 1}`,
    value: `Value ${i + 1}`,
  })),
}

const EMBED_WITH_INVALID_FIELD_NAMES = {
  title: 'Invalid Fields',
  fields: [
    { name: 'a'.repeat(300), value: 'Valid Value' },
    { name: 'Valid Name', value: 'b'.repeat(1100) },
  ],
}

test.group('DiscordWebhookService', (group) => {
  const discordWebhookService = DiscordWebhookService

  group.setup(() => {
    if (!nock.isActive()) {
      nock.activate()
    }
  })

  group.teardown(() => {
    nock.restore()
  })

  group.each.teardown(() => {
    nock.cleanAll()
  })

  test('should create service with valid webhook URL', async ({ assert }) => {
    const service = await discordWebhookService.create({ url: VALID_WEBHOOK_URL })

    assert.ok(service instanceof (discordWebhookService as never))
  })

  test('should create service with custom timeout and retries', async ({ assert }) => {
    const service = await discordWebhookService.create({
      url: VALID_WEBHOOK_URL,
      timeout: 5000,
      retries: 5,
    })

    assert.ok(service instanceof (discordWebhookService as never))
  })

  test('should throw exception for invalid webhook URLL', async ({ assert }) => {
    await assert.rejects(
      async () => discordWebhookService.create({ url: INVALID_WEBHOOK_URL }),
      DiscordWebhookException as never
    )
  })

  test('should throw exception for non-discord webhook URL', async ({ assert }) => {
    const invalidUrl = 'https://example.com/webhook'

    await assert.rejects(
      async () => discordWebhookService.create({ url: invalidUrl }),
      DiscordWebhookException as never
    )
  })

  test('should trim content when setting', async ({ assert }) => {
    const service = await discordWebhookService.create({ url: VALID_WEBHOOK_URL })

    service.setContent('  Hello World  ')

    assert.strictEqual(service.getContentLength(), 11)
  })

  test('should throw exception for content exceeding max length', async ({ assert }) => {
    const service = await discordWebhookService.create({ url: VALID_WEBHOOK_URL })

    const longContent = 'a'.repeat(2001)

    assert.throws(() => service.setContent(longContent), DiscordWebhookException as never)
  })

  test('should handle content at exactly max length', async ({ assert }) => {
    const service = await discordWebhookService.create({ url: VALID_WEBHOOK_URL })
    const maxContent = 'a'.repeat(2000)
    assert.doesNotThrow(() => service.setContent(maxContent))
    assert.strictEqual(service.getContentLength(), 2000)
  })

  test('should set all webhook options', async ({ assert }) => {
    const service = await discordWebhookService.create({ url: VALID_WEBHOOK_URL })
    const options: DiscordWebhookOptions = {
      username: 'TestBot',
      avatarUrl: 'https://example.com/avatar.png',
      allowedMentions: { parse: ['users'] },
      flags: [],
      tts: true,
      thread: {
        name: 'Test Thread',
        tags: ['tag1', 'tag2'],
      },
    }

    const result = service.setOptions(options)
    assert.strictEqual(result, service)
  })

  test('should add single embed', async ({ assert }) => {
    const service = await discordWebhookService.create({ url: VALID_WEBHOOK_URL })
    const result = service.addEmbed(SAMPLE_EMBED)

    assert.strictEqual(result, service)
    assert.strictEqual(service.getEmbedCount(), 1)
  })

  test('should add multiple embeds', async ({ assert }) => {
    const service = await discordWebhookService.create({ url: VALID_WEBHOOK_URL })
    const embeds = [SAMPLE_EMBED, { ...SAMPLE_EMBED, title: 'Second Embed' }]

    const result = service.addEmbeds(embeds)
    assert.strictEqual(result, service)
    assert.strictEqual(service.getEmbedCount(), 2)
  })

  test('should throw exception when exceeding max embeds', async ({ assert }) => {
    const service = await discordWebhookService.create({ url: VALID_WEBHOOK_URL })

    for (let i = 0; i < 10; i++) {
      service.addEmbed({ ...SAMPLE_EMBED, title: `Embed ${i}` })
    }

    assert.throws(() => service.addEmbed(SAMPLE_EMBED), DiscordWebhookException as never)
  })

  test('should validate embed title length', async ({ assert }) => {
    const service = await discordWebhookService.create({ url: VALID_WEBHOOK_URL })

    assert.throws(() => service.addEmbed(LARGE_EMBED), DiscordWebhookException as never)
  })

  test('should validate embed description length', async ({ assert }) => {
    const service = await discordWebhookService.create({ url: VALID_WEBHOOK_URL })
    const embedWithLongDescription = {
      title: 'Valid Title',
      description: 'a'.repeat(4097),
    }

    assert.throws(
      () => service.addEmbed(embedWithLongDescription),
      DiscordWebhookException as never
    )
  })

  test('should validate embed fields count', async ({ assert }) => {
    const service = await discordWebhookService.create({ url: VALID_WEBHOOK_URL })

    assert.throws(
      () => service.addEmbed(EMBED_WITH_TOO_MANY_FIELDS),
      DiscordWebhookException as never
    )
  })

  test('should validate embed field name and value lengths', async ({ assert }) => {
    const service = await discordWebhookService.create({ url: VALID_WEBHOOK_URL })

    assert.throws(
      () => service.addEmbed(EMBED_WITH_INVALID_FIELD_NAMES),
      DiscordWebhookException as never
    )
  })

  test('should detect content when text is present', async ({ assert }) => {
    const service = await discordWebhookService.create({ url: VALID_WEBHOOK_URL })
    service.setContent('Hello')

    assert.isTrue(service.hasContent())
  })

  test('should detect content when embeds are present', async ({ assert }) => {
    const service = await discordWebhookService.create({ url: VALID_WEBHOOK_URL })
    service.addEmbed(SAMPLE_EMBED)

    assert.isTrue(service.hasContent())
  })

  test('should detect content when attachments are present', async ({ assert }) => {
    const service = await discordWebhookService.create({ url: VALID_WEBHOOK_URL })
    service.addAttachment({ filename: 'test.txt' })

    assert.isTrue(service.hasContent())
  })

  test('should detect content when poll is present', async ({ assert }) => {
    const service = await discordWebhookService.create({ url: VALID_WEBHOOK_URL })
    service.setPoll({
      question: { text: 'test' },
      answers: [{ answer_id: 0, poll_media: { text: 'test 1' } }],
      expiry: 0,
      allow_multiselect: false,
      layout_type: 1,
    })

    assert.isTrue(service.hasContent())
  })

  test('should not detect content when all fields are empty', async ({ assert }) => {
    const service = await discordWebhookService.create({ url: VALID_WEBHOOK_URL })

    assert.isFalse(service.hasContent())
  })

  test('should execute webhook successfully', async ({ assert }) => {
    const scope = nock('https://discord.com/api').post(WEBHOOK_PATH).reply(204)

    const service = await discordWebhookService.create({ url: VALID_WEBHOOK_URL })
    service.setContent('Hello World')

    const result = await service.execute()

    console.error(result.error)

    assert.isTrue(scope.isDone())
    assert.isTrue(result.success)
    assert.isUndefined(result.error, undefined)

    scope.done()
  })

  test('should send correct payload structure', async ({ assert }) => {
    let requestBody: any

    const scope = nock('https://discord.com/api')
      .post(WEBHOOK_PATH)
      .reply(204, (_, body) => {
        requestBody = body
      })

    const service = await discordWebhookService.create({ url: VALID_WEBHOOK_URL })
    service
      .setContent('Hello World')
      .setOptions({ username: 'TestBot', tts: true })
      .addEmbed(SAMPLE_EMBED)

    await service.execute()

    assert.deepEqual(requestBody, {
      content: 'Hello World',
      username: 'TestBot',
      tts: true,
      embeds: [
        {
          title: 'Test Embed',
          description: 'Test Description',
          color: 0x00ff00,
        },
      ],
    })

    scope.done()
  })

  test('should fail execution when no content is present', async ({ assert }) => {
    const service = await discordWebhookService.create({ url: VALID_WEBHOOK_URL })

    const result = await service.execute()

    assert.isFalse(result.success)
    assert.strictEqual(result.error, 'Discord Webhook cannot send empty message')
  })
})
