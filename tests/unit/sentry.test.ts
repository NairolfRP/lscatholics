import type { Log } from '@sentry/tanstackstart-react'
import { describe, expect, it } from 'vitest'
import { beforeSendLog, dataCollection } from '#/config/sentry'

/**
 * Sentry v11 collects every category by default, so this config is the only
 * thing standing between real form submissions (contact, parishioner,
 * applications) and Sentry. Pin the baseline so a dependency upgrade that
 * reopens a category fails here instead of in production.
 */
describe('dataCollection', () => {
  it('never collects request or response bodies', () => {
    expect(dataCollection.httpBodies).toEqual([])
  })

  it('does not collect cookies, user info or query data', () => {
    expect(dataCollection.cookies).toBe(false)
    expect(dataCollection.userInfo).toBe(false)
    expect(dataCollection.databaseQueryData).toBe(false)
  })

  it('does not collect GraphQL documents, variables or AI payloads', () => {
    expect(dataCollection.graphQL).toEqual({ document: false, variables: false })
    expect(dataCollection.genAI).toEqual({ inputs: false, outputs: false })
  })

  it('keeps the default denylist on headers and query params', () => {
    const denied = { deny: ['forwarded', '-ip', 'remote-', 'via', '-user'] }

    expect(dataCollection.httpHeaders).toEqual({ request: denied, response: denied })
    expect(dataCollection.urlQueryParams).toEqual(denied)
  })

  it('keeps stack context at the v10 default', () => {
    expect(dataCollection.frameContextLines).toBe(7)
  })
})

describe('beforeSendLog', () => {
  it('removes credentials and raw payloads', () => {
    const log = {
      level: 'info',
      message: 'Donation payment initiated',
      attributes: {
        source: 'donation',
        payment_id: 'pay_123',
        amount: 500,
        apiToken: 'secret',
        password: 'hunter2',
        rawBody: '{"private":true}',
        data: { phone: '123456' },
      },
    } satisfies Log

    expect(beforeSendLog(log)).toEqual({
      level: 'info',
      message: 'Donation payment initiated',
      attributes: {
        source: 'donation',
        payment_id: 'pay_123',
        amount: 500,
      },
    })
  })

  it('keeps in-game roleplay attributes and errors for debugging', () => {
    const log = {
      level: 'error',
      message: 'Donation payment initiation failed',
      attributes: {
        firstname: 'Jean',
        lastname: 'Dupont',
        phone: '4821337',
        address: '12 Rue de la Paix',
        err: { message: 'Card rejected' },
      },
    } satisfies Log

    expect(beforeSendLog(log)).toEqual(log)
  })
})
