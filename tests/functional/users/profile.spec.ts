import { test } from '@japa/runner'
import { DateTime } from 'luxon'
import User from '#users/models/user'
import testUtils from '@adonisjs/core/services/test_utils'
import nock from 'nock'
import sinon from 'sinon'
import { DiscordTokenService } from '#discord/services/discord_token_service'

test.group('Profile - Show', (group) => {
  let discordTokenService: DiscordTokenService

  group.each.setup(() => testUtils.db().wrapInGlobalTransaction())

  group.setup(() => {
    discordTokenService = new DiscordTokenService()

    if (!nock.isActive()) {
      nock.activate()
    }
  })

  group.teardown(() => {
    nock.cleanAll()
    nock.restore()
    sinon.restore()
  })

  group.each.teardown(() => {
    sinon.restore()
  })

  test('displays profile page for authenticated user', async ({ client }) => {
    const user = await User.create({ name: 'Test User' })

    const response = await client.get('/profile').loginAs(user).withInertia()

    response.assertStatus(200)
    response.assertInertiaComponent('profile')
  })

  test('redirects unauthenticated users', async ({ client }) => {
    const response = await client.get('/profile')

    response.assertRedirectsTo('/')
  })

  test('shows null when no Discord account linked', async ({ client }) => {
    const user = await User.create({ name: 'Test User' })

    const response = await client.get('/profile').loginAs(user).withInertia()

    response.assertInertiaPropsContains({
      discordUser: null,
    })
  })

  test('shows Discord user when account linked with valid token', async ({ client, assert }) => {
    const user = await User.create({ name: 'Test User' })

    await user.related('accounts').create({
      providerId: 'discord',
      accountId: '123456789',
      accessToken: 'valid_token',
      refreshToken: 'refresh_token',
      accessTokenExpiresAt: DateTime.now().plus({ hours: 1 }),
    })

    sinon.stub(discordTokenService, 'getValidAccessToken').resolves('valid_token')

    nock('https://discord.com/api')
      .get(`/users/@me`)
      .matchHeader('Authorization', 'Bearer valid_token')
      .matchHeader('Accept', 'application/json')
      .reply(200, {
        id: '123456789',
        username: 'Test User',
        discriminator: '1234',
        avatar: 'avatar_url',
      })

    const response = await client.get('/profile').loginAs(user).withInertia()

    response.assertStatus(200)
    response.assertInertiaPropsContains({
      discordUser: {
        id: '123456789',
        username: 'Test User',
        avatar: 'https://cdn.discordapp.com/avatars/123456789/avatar_url.png',
      },
    })
    const props = response.body().props

    assert.exists(props.discordUser)
    assert.isTrue(nock.isDone())
  })

  test('removes expired Discord account when refresh fails', async ({ client, assert }) => {
    const user = await User.create({ name: 'Test User' })

    await user.related('accounts').create({
      providerId: 'discord',
      accountId: '123456789',
      accessToken: 'expired_token',
      refreshToken: 'invalid_refresh',
      accessTokenExpiresAt: DateTime.now().minus({ hours: 1 }),
    })

    await client.get('/profile').loginAs(user).withInertia()

    const account = await user.related('accounts').query().where('provider_id', 'discord').first()

    assert.isNull(account)
  })

  test('handles errors gracefully and returns null discordUser', async ({ client }) => {
    const user = await User.create({ name: 'Test User' })

    await user.related('accounts').create({
      providerId: 'discord',
      accountId: '123456789',
      accessToken: 'token_that_will_cause_error',
      refreshToken: 'refresh',
      accessTokenExpiresAt: DateTime.now().plus({ hours: 1 }),
    })

    const response = await client.get('/profile').loginAs(user).withInertia()

    response.assertStatus(200)
    response.assertInertiaComponent('profile')
  })
})
