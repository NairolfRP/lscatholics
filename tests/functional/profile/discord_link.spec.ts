import { test } from '@japa/runner'
import User from '#auth/models/user'
import { DateTime } from 'luxon'
import testUtils from '@adonisjs/core/services/test_utils'
import nock from 'nock'

test.group('Profile - Discord Link', (group) => {
  group.each.setup(() => testUtils.db().truncate())

  group.setup(() => {
    if (!nock.isActive()) {
      nock.activate()
    }
  })

  group.teardown(() => {
    nock.cleanAll()
    nock.restore()
  })

  test('requires authentication', async ({ client }) => {
    const response = await client.get('/api/auth/redirect/discord')

    response.assertRedirectsTo('/')
  })

  test('redirects to Discord OAuth', async ({ client, assert }) => {
    const user = await User.create({ name: 'Test User' })

    const response = await client.get('/api/auth/redirect/discord').loginAs(user).redirects(0)

    response.assertStatus(302)

    const location = response.header('location')
    assert.isDefined(location)
    assert.include(location as string, 'discord.com/oauth2/authorize')
    assert.include(location as string, 'client_id=')
  })

  test('handles OAuth access denied', async ({ client }) => {
    const user = await User.create({ name: 'Test User' })

    const response = await client
      .get('/api/auth/callback/discord')
      .qs({ error: 'access_denied' })
      .loginAs(user)

    response.assertStatus(400)
    response.assertBodyContains({ message: 'You have cancelled the login process' })
  })

  test('handles OAuth state mismatch', async ({ client }) => {
    const user = await User.create({ name: 'Test User' })

    const response = await client
      .get('/api/auth/callback/discord')
      .qs({ code: 'valid_code', state: 'invalid_state' })
      .loginAs(user)

    response.assertStatus(400)
    response.assertBodyContains({
      message: 'We are unable to verify the request. Please try again',
    })
  })

  test('handles generic OAuth errors', async ({ client }) => {
    const user = await User.create({ name: 'Test User' })

    const response = await client
      .get('/api/auth/callback/discord')
      .qs({ error: 'server_error', error_description: 'OAuth error' })
      .loginAs(user)

    response.assertStatus(400)
    response.assertBody({
      message: 'An error has occurred',
      error: 'server_error',
    })
  })

  test('creates new Discord account link', async ({ client, assert }) => {
    const user = await User.create({ name: 'Test User' })

    nock('https://discord.com/api')
      .post('/oauth2/token', (body) => {
        return (
          body.grant_type === 'authorization_code' &&
          //body.redirect_uri === '' &&
          body.client_id === 'fake_discord_id' &&
          body.client_secret === 'fake_discord_secret' &&
          body.state === 'valid_state' &&
          body.code === 'valid_auth_code'
        )
      })
      .matchHeader('Accept', 'application/json')
      .matchHeader('Content-Type', 'application/x-www-form-urlencoded;charset=UTF-8')
      .reply(200, {
        access_token: 'new_access_token',
        token_type: 'Bearer',
        expires_in: 604800,
        refresh_token: 'new_refresh_token',
        scope: 'identify',
      })

    nock('https://discord.com/api')
      .get('/users/@me')
      .matchHeader('Authorization', 'Bearer new_access_token')
      .matchHeader('Accept', 'application/json')
      .reply(200, {
        id: '987654321',
        username: 'NewUser',
        discriminator: '0001',
        avatar: 'avatar_hash',
      })

    const response = await client
      .get('/api/auth/callback/discord')
      .qs({ code: 'valid_auth_code', state: 'valid_state' })
      .withCsrfToken()
      .withEncryptedCookie('discord_oauth_state', 'valid_state')
      .loginAs(user)

    response.assertRedirectsTo('/profile')

    const account = await user.related('accounts').query().where('provider_id', 'discord').first()

    assert.isNotNull(account)

    assert.isObject(account)
    assert.equal(account!.accountId, '987654321')
    assert.equal(account!.getDecryptedAccessToken(), 'new_access_token')
    assert.equal(account!.getDecryptedRefreshToken(), 'new_refresh_token')
    assert.isTrue(nock.isDone())
  })

  test('prevents linking different Discord account', async ({ client, assert }) => {
    const user = await User.create({ name: 'Test User' })

    await user.related('accounts').create({
      providerId: 'discord',
      accountId: '123456789',
      accessToken: 'existing_token',
      refreshToken: 'existing_refresh',
      accessTokenExpiresAt: DateTime.now().plus({ hours: 1 }),
    })

    nock('https://discord.com/api')
      .post('/oauth2/token', (body) => {
        return (
          body.grant_type === 'authorization_code' &&
          //body.redirect_uri === '' &&
          body.client_id === 'fake_discord_id' &&
          body.client_secret === 'fake_discord_secret' &&
          body.state === 'valid_state' &&
          body.code === 'valid_auth_code'
        )
      })
      .matchHeader('Accept', 'application/json')
      .matchHeader('Content-Type', 'application/x-www-form-urlencoded;charset=UTF-8')
      .reply(200, {
        access_token: 'different_access_token',
        token_type: 'Bearer',
        expires_in: 604800,
        refresh_token: 'different_refresh_token',
        scope: 'identify',
      })

    nock('https://discord.com/api')
      .get('/users/@me')
      .matchHeader('Authorization', 'Bearer different_access_token')
      .matchHeader('Accept', 'application/json')
      .reply(200, {
        id: '999999999',
        username: 'DifferentUser',
        discriminator: '0002',
        avatar: 'different_avatar_hash',
      })

    const response = await client
      .get('/api/auth/callback/discord')
      .qs({ code: 'valid_auth_code', state: 'valid_state' })
      .withCsrfToken()
      .withEncryptedCookie('discord_oauth_state', 'valid_state')
      .loginAs(user)

    response.assertStatus(401)
    response.assertBodyContains({ message: 'Other Discord account is linked' })

    const account = await user.related('accounts').query().where('provider_id', 'discord').first()

    assert.isNotNull(account)
    assert.equal(account!.accountId, '123456789')
    assert.equal(account!.getDecryptedAccessToken(), 'existing_token')
  })

  test('updates tokens when linking same Discord account', async ({ client, assert }) => {
    const user = await User.create({ name: 'Test User' })

    const account = await user.related('accounts').create({
      providerId: 'discord',
      accountId: '123456789',
      accessToken: 'old_token',
      refreshToken: 'old_refresh',
      accessTokenExpiresAt: DateTime.now().plus({ hours: 1 }),
    })

    nock('https://discord.com/api')
      .post('/oauth2/token', (body) => {
        return (
          body.grant_type === 'authorization_code' &&
          //body.redirect_uri === '' &&
          body.client_id === 'fake_discord_id' &&
          body.client_secret === 'fake_discord_secret' &&
          body.state === 'valid_state' &&
          body.code === 'valid_auth_code'
        )
      })
      .matchHeader('Accept', 'application/json')
      .matchHeader('Content-Type', 'application/x-www-form-urlencoded;charset=UTF-8')
      .reply(200, {
        access_token: 'updated_access_token',
        token_type: 'Bearer',
        expires_in: 604800,
        refresh_token: 'updated_refresh_token',
        scope: 'identify',
      })

    nock('https://discord.com/api')
      .get('/users/@me')
      .matchHeader('Authorization', 'Bearer updated_access_token')
      .matchHeader('Accept', 'application/json')
      .reply(200, {
        id: '123456789',
        username: 'SameUser',
        discriminator: '0001',
        avatar: 'avatar_hash',
      })

    const response = await client
      .get('/api/auth/callback/discord')
      .qs({ code: 'valid_auth_code', state: 'valid_state' })
      .withCsrfToken()
      .withEncryptedCookie('discord_oauth_state', 'valid_state')
      .loginAs(user)

    response.assertRedirectsTo('/profile')

    await account.refresh()

    assert.equal(account.accountId, '123456789')
    assert.equal(account.getDecryptedAccessToken(), 'updated_access_token')
    assert.equal(account.getDecryptedRefreshToken(), 'updated_refresh_token')

    const accountsCount = await user
      .related('accounts')
      .query()
      .where('provider_id', 'discord')
      .count('* as total')

    assert.equal(accountsCount[0].$extras.total, 1)
  })
})
