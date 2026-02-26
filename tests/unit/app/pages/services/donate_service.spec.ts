import { test } from '@japa/runner'
import sinon from 'sinon'
import { DonateService } from '#services/donate_service'
import { DiscordWebhookService } from '#services/discord_webhook_service'
import env from '#start/env'
import type { Mock } from 'node:test'
import type { DonateMetadata } from '#validators/donate'

test.group('Donate service', (group) => {
  let service: DonateService
  let mockDiscordWebhook: any

  group.setup(() => {
    service = new DonateService()
  })

  group.each.setup(() => {
    mockDiscordWebhook = {
      addEmbed: sinon.stub().returnsThis(),
      setOptions: sinon.stub().returnsThis(),
      execute: sinon.stub().resolves(),
    }

    sinon.stub(DiscordWebhookService, 'create').resolves(mockDiscordWebhook)
  })

  group.each.teardown(() => {
    sinon.restore()
  })

  test('should send complete notification', async ({ assert }) => {
    const metadata: Omit<DonateMetadata, 'fleecaConfirmation'> = {
      amount: 1000,
      firstname: 'John',
      lastname: 'Doe',
      age: 25,
      ethnicity: 'white' as const,
      phone: '1234567',
      address: '123 Main St',
      district: 'downtown_los_santos' as const,
      isOrganization: false,
      organizationName: undefined,
      anonymous: false,
    }

    await service.sendPrivateDonateNotification(metadata)

    assert.isTrue(
      (DiscordWebhookService as Mock<any>).create.calledWith({
        url: env.get('DONATE_PRIVATE_NOTIFICATION_WEBHOOK'),
      })
    )
    assert.isTrue(mockDiscordWebhook.addEmbed.called)
    assert.isTrue(mockDiscordWebhook.execute.called)

    const embedCall = mockDiscordWebhook.addEmbed.getCall(0)
    const embedData = embedCall.args[0]
    assert.strictEqual(embedData.title, 'Don réalisé en ligne !')
    assert.isTrue(Array.isArray(embedData.fields))

    const fieldNames = embedData.fields.map((f: Record<string, string>) => f.name)
    assert.include(fieldNames, 'Identité')
    assert.include(fieldNames, 'Âge')
    assert.include(fieldNames, 'Téléphone')
    assert.include(fieldNames, 'Adresse')
    assert.include(fieldNames, 'Montant du don')
    assert.include(fieldNames, 'Le don peut-il être rendu public ?')
  })

  test('should handle organization donation', async ({ assert }) => {
    const metadata: Omit<DonateMetadata, 'fleecaConfirmation'> = {
      amount: 5000,
      firstname: 'Jane',
      lastname: 'Smith',
      age: undefined,
      ethnicity: undefined,
      phone: undefined,
      address: undefined,
      district: undefined,
      isOrganization: true,
      organizationName: 'ACME Corp',
      anonymous: true,
    }

    await service.sendPrivateDonateNotification(metadata)

    const embedCall = mockDiscordWebhook.addEmbed.getCall(0)
    const embedData = embedCall.args[0]
    const fieldNames = embedData.fields.map((f: Record<string, string>) => f.name)

    assert.include(fieldNames, "Au nom d'une société/organisation")

    const orgField = embedData.fields.find(
      (f: Record<string, string>) => f.name === "Au nom d'une société/organisation"
    )
    assert.strictEqual(orgField.value, 'ACME Corp')

    const anonymousField = embedData.fields.find(
      (f: Record<string, string>) => f.name === 'Le don peut-il être rendu public ?'
    )
    assert.strictEqual(anonymousField.value, '⛔ NON')
  })

  test('should skip when webhook URL missing', async ({ assert }) => {
    const originalWebhookUrl = env.get('DONATE_PRIVATE_NOTIFICATION_WEBHOOK')
    env.set('DONATE_PRIVATE_NOTIFICATION_WEBHOOK', '')
    const metadata: Omit<DonateMetadata, 'fleecaConfirmation'> = {
      amount: 1000,
      firstname: 'John',
      lastname: 'Doe',
      isOrganization: false,
      anonymous: false,
    }

    const result = await service.sendPrivateDonateNotification(metadata)

    assert.isUndefined(result)
    assert.isFalse((DiscordWebhookService as Mock<any>).create.called)

    env.set('DONATE_PRIVATE_NOTIFICATION_WEBHOOK', originalWebhookUrl)
  })

  test('should send public notification for non-anonymous donation', async ({ assert }) => {
    const metadata: Omit<DonateMetadata, 'fleecaConfirmation'> = {
      amount: 1000,
      firstname: 'John',
      lastname: 'Doe',
      age: 25,
      isOrganization: false,
      organizationName: undefined,
      anonymous: false,
    }

    await service.sendPublicDonateNotification(metadata)

    assert.isTrue(
      (DiscordWebhookService as Mock<any>).create.calledWith({
        url: env.get('DONATE_PUBLIC_NOTIFICATION_WEBHOOK'),
      })
    )
    assert.isTrue(mockDiscordWebhook.addEmbed.called)
    assert.isTrue(
      mockDiscordWebhook.setOptions.calledWith({
        username: 'LS Catholics',
        avatarUrl: 'https://i.imgur.com/0f4ZQS0.png',
      })
    )

    const embedCall = mockDiscordWebhook.addEmbed.getCall(0)
    const embedData = embedCall.args[0]
    assert.strictEqual(embedData.title, "Un nouveau don en soutien à la mission de l'Église !")
    assert.include(embedData.description, 'John Doe')
    assert.include(embedData.description, '$1,000')
  })

  test('should skip anonymous donations', async ({ assert }) => {
    const metadata: Omit<DonateMetadata, 'fleecaConfirmation'> = {
      amount: 1000,
      firstname: 'John',
      lastname: 'Doe',
      age: 25,
      isOrganization: false,
      organizationName: undefined,
      anonymous: true,
    }

    const result = await service.sendPublicDonateNotification(metadata)

    assert.isUndefined(result)
    assert.isFalse((DiscordWebhookService as Mock<any>).create.called)
  })

  test('should use correct embed color based on amount', async ({ assert }) => {
    const testCases = [
      { amount: 1000000, expectedColor: 16774912 }, // >= 1M
      { amount: 100000, expectedColor: 11403519 }, // >= 100K
      { amount: 50000, expectedColor: 4607 }, // >= 50K
      { amount: 10000, expectedColor: 358886 }, // < 50K
    ]

    for (const testCase of testCases) {
      mockDiscordWebhook.addEmbed.resetHistory()

      const metadata: Omit<DonateMetadata, 'fleecaConfirmation'> = {
        amount: testCase.amount,
        firstname: 'John',
        lastname: 'Doe',
        age: undefined,
        isOrganization: false,
        organizationName: undefined,
        anonymous: false,
      }

      await service.sendPublicDonateNotification(metadata)

      const embedCall = mockDiscordWebhook.addEmbed.getCall(0)
      const embedData = embedCall.args[0]
      assert.strictEqual(embedData.color, testCase.expectedColor)
    }
  })

  test('should handle organization donations differently', async ({ assert }) => {
    const metadata: Omit<DonateMetadata, 'fleecaConfirmation'> = {
      amount: 5000,
      firstname: 'Jane',
      lastname: 'Smith',
      age: 30,
      isOrganization: true,
      organizationName: 'ACME Corp',
      anonymous: false,
    }

    await service.sendPublicDonateNotification(metadata)

    const embedCall = mockDiscordWebhook.addEmbed.getCall(0)
    const embedData = embedCall.args[0]
    assert.include(embedData.description, 'ACME Corp')
    assert.include(embedData.description, 'Jane Smith')
    assert.include(embedData.description, '30 ans')
    assert.include(embedData.description, "Merci à l'organisation")
  })
})
