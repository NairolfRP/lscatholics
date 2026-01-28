import { test } from '@japa/runner'
import nock from 'nock'
import { DateTime } from 'luxon'
import User from '#auth/models/user'
import { DiscordTokenService } from '#auth/services/discord_token_service'
import { HttpContextFactory } from '@adonisjs/core/factories/http'
import testUtils from '@adonisjs/core/services/test_utils'

test.group('DiscordTokenService - getValidAccessToken', (group) => {
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

  test('returns existing token when not expired', async ({ assert }) => {
    const user = await User.create({ name: 'Test User' })

    const account = await user.related('accounts').create({
      providerId: 'discord',
      accountId: '123456789',
      accessToken: 'valid_token',
      refreshToken: 'refresh_token',
      accessTokenExpiresAt: DateTime.now().plus({ hours: 1 }),
    })

    const ctx = new HttpContextFactory().create()
    const token = await DiscordTokenService.getValidAccessToken(ctx, account)

    assert.equal(token, 'valid_token')
  })

  test('refreshes token when expired', async ({ assert }) => {
    const user = await User.create({ name: 'Test User' })

    const account = await user.related('accounts').create({
      providerId: 'discord',
      accountId: '123456789',
      accessToken: 'expired_token',
      refreshToken: 'valid_refresh_token',
      accessTokenExpiresAt: DateTime.now().minus({ hours: 1 }),
    })

    nock('https://discord.com/api/v10')
      .post('/oauth2/token', {
        client_id: 'fake_discord_id',
        client_secret: 'fake_discord_secret',
        grant_type: 'refresh_token',
        refresh_token: 'valid_refresh_token',
      })
      .matchHeader('Content-Type', 'application/x-www-form-urlencoded')
      .reply(200, {
        access_token: 'new_access_token',
        token_type: 'Bearer',
        expires_in: 604800,
        refresh_token: 'new_refresh_token',
        scope: 'identify',
      })

    const ctx = new HttpContextFactory().create()
    const token = await DiscordTokenService.getValidAccessToken(ctx, account)

    assert.equal(token, 'new_access_token')

    await account.refresh()
    assert.equal(account.getDecryptedAccessToken(), 'new_access_token')
    assert.equal(account.getDecryptedRefreshToken(), 'new_refresh_token')
    assert.isTrue(nock.isDone())
  })

  test('refreshes token when expiring soon (< 5 minutes)', async ({ assert }) => {
    const user = await User.create({ name: 'Test User' })

    const account = await user.related('accounts').create({
      providerId: 'discord',
      accountId: '123456789',
      accessToken: 'soon_expired_token',
      refreshToken: 'refresh_token',
      accessTokenExpiresAt: DateTime.now().plus({ minutes: 3 }),
    })

    nock('https://discord.com/api/v10')
      .post('/oauth2/token', {
        client_id: 'fake_discord_id',
        client_secret: 'fake_discord_secret',
        grant_type: 'refresh_token',
        refresh_token: 'refresh_token',
      })
      .matchHeader('Content-Type', 'application/x-www-form-urlencoded')
      .reply(200, {
        access_token: 'refreshed_token',
        token_type: 'Bearer',
        expires_in: 604800,
        refresh_token: 'new_refresh_token',
        scope: 'identify',
      })

    const ctx = new HttpContextFactory().create()
    const token = await DiscordTokenService.getValidAccessToken(ctx, account)

    assert.equal(token, 'refreshed_token')
    assert.isTrue(nock.isDone())
  })

  test('returns null when refresh fails with 400', async ({ assert }) => {
    const user = await User.create({ name: 'Test User' })

    const account = await user.related('accounts').create({
      providerId: 'discord',
      accountId: '123456789',
      accessToken: 'expired_token',
      refreshToken: 'invalid_refresh',
      accessTokenExpiresAt: DateTime.now().minus({ hours: 1 }),
    })

    nock('https://discord.com/api/v10')
      .post('/oauth2/token', {
        client_id: 'fake_discord_id',
        client_secret: 'fake_discord_secret',
        grant_type: 'refresh_token',
        refresh_token: 'invalid_refresh',
      })
      .matchHeader('Content-Type', 'application/x-www-form-urlencoded')
      .reply(400, {
        error: 'invalid_grant',
      })

    const ctx = new HttpContextFactory().create()
    const token = await DiscordTokenService.getValidAccessToken(ctx, account)

    assert.isNull(token)
    assert.isTrue(nock.isDone())
  })

  test('returns null when refresh token is missing', async ({ assert }) => {
    const user = await User.create({ name: 'Test User' })

    const account = await user.related('accounts').create({
      providerId: 'discord',
      accountId: '123456789',
      accessToken: 'expired_token',
      refreshToken: null,
      accessTokenExpiresAt: DateTime.now().minus({ hours: 1 }),
    })

    const ctx = new HttpContextFactory().create()
    const token = await DiscordTokenService.getValidAccessToken(ctx, account)

    assert.isNull(token)
  })

  test('returns null when Discord API returns non-400 error', async ({ assert }) => {
    const user = await User.create({ name: 'Test User' })

    const account = await user.related('accounts').create({
      providerId: 'discord',
      accountId: '123456789',
      accessToken: 'expired_token',
      refreshToken: 'refresh_token',
      accessTokenExpiresAt: DateTime.now().minus({ hours: 1 }),
    })

    nock('https://discord.com/api/v10').post('/oauth2/token').reply(500)

    const ctx = new HttpContextFactory().create()
    const token = await DiscordTokenService.getValidAccessToken(ctx, account)

    assert.isNull(token)
    assert.isTrue(nock.isDone())
  })
})

test.group('DiscordTokenService - refreshAccessToken', (group) => {
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

  test('successfully refreshes token and updates account', async ({ assert }) => {
    const user = await User.create({ name: 'Test User' })

    const account = await user.related('accounts').create({
      providerId: 'discord',
      accountId: '123456789',
      accessToken: 'old_token',
      refreshToken: 'old_refresh',
      accessTokenExpiresAt: DateTime.now().minus({ hours: 1 }),
    })

    nock('https://discord.com/api/v10')
      .post('/oauth2/token', {
        client_id: 'fake_discord_id',
        client_secret: 'fake_discord_secret',
        grant_type: 'refresh_token',
        refresh_token: 'old_refresh',
      })
      .matchHeader('Content-Type', 'application/x-www-form-urlencoded')
      .reply(200, {
        access_token: 'new_access_token',
        token_type: 'Bearer',
        expires_in: 604800,
        refresh_token: 'new_refresh_token',
        scope: 'identify',
      })

    const ctx = new HttpContextFactory().create()
    const token = await DiscordTokenService.refreshAccessToken(ctx, account)

    assert.equal(token, 'new_access_token')

    await account.refresh()
    assert.equal(account.getDecryptedAccessToken(), 'new_access_token')
    assert.equal(account.getDecryptedRefreshToken(), 'new_refresh_token')
    assert.isTrue(account.accessTokenExpiresAt!.diffNow('days').days > 6)
    assert.isTrue(nock.isDone())
  })
})
